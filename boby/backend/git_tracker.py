import os
from pathlib import Path
from typing import Dict, List
from collections import Counter
from git import Repo, InvalidGitRepositoryError


def get_git_history(repo_path: str) -> Dict:
    """
    Reads Git history and returns last 10 commits with file change information.
    
    Args:
        repo_path: Path to the repository root
        
    Returns:
        Dictionary with commits and most modified files
    """
    try:
        repo = Repo(repo_path)
    except InvalidGitRepositoryError:
        return {
            "commits": [],
            "most_modified_files": [],
            "error": "Not a valid Git repository"
        }
    
    commits_data = []
    file_modification_count = Counter()
    
    # Get last 10 commits
    commits = list(repo.iter_commits('HEAD', max_count=10))
    
    for commit in commits:
        files_changed = []
        
        # Get files changed in this commit
        if commit.parents:
            # Compare with parent commit
            parent = commit.parents[0]
            diffs = parent.diff(commit)
            
            for diff in diffs:
                if diff.a_path:
                    files_changed.append(diff.a_path)
                    file_modification_count[diff.a_path] += 1
                if diff.b_path and diff.b_path != diff.a_path:
                    files_changed.append(diff.b_path)
                    file_modification_count[diff.b_path] += 1
        else:
            # First commit - get all files
            for item in commit.tree.traverse():
                if item.type == 'blob':
                    files_changed.append(item.path)
                    file_modification_count[item.path] += 1
        
        commit_data = {
            "hash": commit.hexsha[:8],
            "message": commit.message.strip(),
            "author": commit.author.name,
            "date": commit.committed_datetime.isoformat(),
            "files_changed": list(set(files_changed))
        }
        
        commits_data.append(commit_data)
    
    # Get most modified files (modified more than 3 times)
    most_modified = []
    for file_path, count in file_modification_count.most_common():
        most_modified.append({
            "file": file_path,
            "modification_count": count,
            "high_frequency": count > 3
        })
    
    return {
        "commits": commits_data,
        "most_modified_files": most_modified
    }


def get_file_history(repo_path: str, file_path: str) -> List[Dict]:
    """
    Gets the commit history for a specific file.
    
    Args:
        repo_path: Path to the repository root
        file_path: Relative path to the file
        
    Returns:
        List of commits that modified the file
    """
    try:
        repo = Repo(repo_path)
        commits = list(repo.iter_commits(paths=file_path, max_count=10))
        
        file_commits = []
        for commit in commits:
            file_commits.append({
                "hash": commit.hexsha[:8],
                "message": commit.message.strip(),
                "author": commit.author.name,
                "date": commit.committed_datetime.isoformat()
            })
        
        return file_commits
    except Exception as e:
        return []


def get_recent_changes(repo_path: str, days: int = 7) -> Dict:
    """
    Gets files changed in the last N days.
    
    Args:
        repo_path: Path to the repository root
        days: Number of days to look back
        
    Returns:
        Dictionary with recently changed files
    """
    try:
        repo = Repo(repo_path)
        from datetime import datetime, timedelta
        
        since_date = datetime.now() - timedelta(days=days)
        commits = list(repo.iter_commits('HEAD', since=since_date))
        
        changed_files = Counter()
        
        for commit in commits:
            if commit.parents:
                parent = commit.parents[0]
                diffs = parent.diff(commit)
                
                for diff in diffs:
                    if diff.a_path:
                        changed_files[diff.a_path] += 1
                    if diff.b_path and diff.b_path != diff.a_path:
                        changed_files[diff.b_path] += 1
        
        recent_files = [
            {"file": file_path, "changes": count}
            for file_path, count in changed_files.most_common()
        ]
        
        return {
            "days": days,
            "total_commits": len(commits),
            "changed_files": recent_files
        }
    except Exception as e:
        return {
            "error": str(e),
            "days": days,
            "total_commits": 0,
            "changed_files": []
        }

# Made with Bob
