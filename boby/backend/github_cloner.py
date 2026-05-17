import os
import re
import shutil
from pathlib import Path
from typing import Dict, Optional
from git import Repo, GitCommandError
import tempfile


class GitHubCloner:
    """Handles cloning and managing GitHub repositories"""
    
    def __init__(self, clone_dir: Optional[str] = None):
        """
        Initialize the GitHub cloner
        
        Args:
            clone_dir: Directory where repos will be cloned (default: temp directory)
        """
        if clone_dir is None:
            self.clone_dir = Path(tempfile.gettempdir()) / "boby_cloned_repos"
        else:
            self.clone_dir = Path(clone_dir)
        
        # Create clone directory if it doesn't exist
        self.clone_dir.mkdir(parents=True, exist_ok=True)
    
    def validate_github_url(self, url: str) -> Dict[str, str]:
        """
        Validate and parse a GitHub URL
        
        Args:
            url: GitHub repository URL
            
        Returns:
            Dictionary with owner, repo, and normalized URL
            
        Raises:
            ValueError: If URL is invalid
        """
        # Support multiple GitHub URL formats:
        # - https://github.com/owner/repo
        # - https://github.com/owner/repo.git
        # - git@github.com:owner/repo.git
        # - github.com/owner/repo
        
        patterns = [
            r'(?:https?://)?(?:www\.)?github\.com/([^/]+)/([^/\.]+)(?:\.git)?/?$',
            r'git@github\.com:([^/]+)/([^/\.]+)(?:\.git)?$'
        ]
        
        for pattern in patterns:
            match = re.match(pattern, url.strip())
            if match:
                owner, repo = match.groups()
                normalized_url = f"https://github.com/{owner}/{repo}.git"
                return {
                    "owner": owner,
                    "repo": repo,
                    "url": normalized_url
                }
        
        raise ValueError(f"Invalid GitHub URL format: {url}")
    
    def get_repo_local_path(self, owner: str, repo: str) -> Path:
        """Get the local path where a repo would be cloned"""
        return self.clone_dir / f"{owner}_{repo}"
    
    def clone_repository(self, github_url: str, force_reclone: bool = False) -> Dict:
        """
        Clone a GitHub repository
        
        Args:
            github_url: GitHub repository URL
            force_reclone: If True, delete existing clone and re-clone
            
        Returns:
            Dictionary with status and local path
        """
        try:
            # Validate and parse URL
            repo_info = self.validate_github_url(github_url)
            owner = repo_info["owner"]
            repo = repo_info["repo"]
            url = repo_info["url"]
            
            # Get local path
            local_path = self.get_repo_local_path(owner, repo)
            
            # Check if already cloned
            if local_path.exists():
                if force_reclone:
                    print(f"🗑️  Removing existing clone: {local_path}")
                    shutil.rmtree(local_path)
                else:
                    print(f"✅ Repository already cloned: {local_path}")
                    return {
                        "status": "already_cloned",
                        "path": str(local_path),
                        "owner": owner,
                        "repo": repo,
                        "message": "Repository already exists locally"
                    }
            
            # Clone the repository with full history for git tracking features
            print(f"📥 Cloning {url} to {local_path}...")
            Repo.clone_from(url, local_path)  # Full clone to enable history tracking
            
            print(f"✅ Successfully cloned {owner}/{repo}")
            return {
                "status": "cloned",
                "path": str(local_path),
                "owner": owner,
                "repo": repo,
                "message": f"Successfully cloned {owner}/{repo}"
            }
            
        except ValueError as e:
            return {
                "status": "error",
                "error": "invalid_url",
                "message": str(e)
            }
        except GitCommandError as e:
            error_msg = str(e)
            if "Repository not found" in error_msg or "not found" in error_msg.lower():
                return {
                    "status": "error",
                    "error": "not_found",
                    "message": "Repository not found. It may be private or doesn't exist."
                }
            elif "Authentication failed" in error_msg:
                return {
                    "status": "error",
                    "error": "authentication",
                    "message": "Authentication failed. Repository may be private."
                }
            else:
                return {
                    "status": "error",
                    "error": "clone_failed",
                    "message": f"Failed to clone repository: {error_msg}"
                }
        except Exception as e:
            return {
                "status": "error",
                "error": "unknown",
                "message": f"Unexpected error: {str(e)}"
            }
    
    def cleanup_old_repos(self, max_repos: int = 10):
        """
        Clean up old cloned repositories to save disk space
        
        Args:
            max_repos: Maximum number of repos to keep
        """
        if not self.clone_dir.exists():
            return
        
        # Get all cloned repos sorted by modification time
        repos = sorted(
            [d for d in self.clone_dir.iterdir() if d.is_dir()],
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )
        
        # Remove oldest repos if we exceed max_repos
        if len(repos) > max_repos:
            for repo in repos[max_repos:]:
                print(f"🗑️  Cleaning up old repo: {repo.name}")
                shutil.rmtree(repo)
    
    def get_cloned_repos(self) -> list:
        """Get list of all cloned repositories"""
        if not self.clone_dir.exists():
            return []
        
        repos = []
        for repo_dir in self.clone_dir.iterdir():
            if repo_dir.is_dir():
                # Parse owner_repo format
                parts = repo_dir.name.split("_", 1)
                if len(parts) == 2:
                    repos.append({
                        "owner": parts[0],
                        "repo": parts[1],
                        "path": str(repo_dir),
                        "size_mb": sum(f.stat().st_size for f in repo_dir.rglob('*') if f.is_file()) / (1024 * 1024)
                    })
        
        return repos


# Global instance
github_cloner = GitHubCloner()

# Made with Bob
