import os
import json
from typing import Dict, List, Set
from pathlib import Path
import git
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models import ModelInference

from analyzer import scan_repository
from git_tracker import get_git_history

# Load environment variables
load_dotenv()

# Watsonx credentials
WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")

# Model configuration
MODEL_ID = "meta-llama/llama-3-3-70b-instruct"

# Global client variable
_client = None

def _get_api_client():
    """Lazy initialization of the API Client."""
    global _client
    if _client is None:
        if not WATSONX_API_KEY:
            raise ValueError("WATSONX_API_KEY is not set. Please check your .env file.")
        credentials = {
            "url": WATSONX_URL,
            "apikey": WATSONX_API_KEY
        }
        _client = APIClient(credentials)
    return _client


def _get_model_inference():
    """Initialize model inference with project ID."""
    api_client = _get_api_client()
    if not WATSONX_PROJECT_ID:
         raise ValueError("WATSONX_PROJECT_ID is not set. Please check your .env file.")
    return ModelInference(
        model_id=MODEL_ID,
        api_client=api_client,
        project_id=WATSONX_PROJECT_ID,
        params={
            "decoding_method": "greedy",
            "max_new_tokens": 2000,
            "temperature": 0.1,
            "repetition_penalty": 1.0
        }
    )


def _extract_json_from_response(response_text: str) -> dict:
    """
    Extract JSON from response text, handling markdown code blocks.
    
    Args:
        response_text: Raw response text from the model
        
    Returns:
        Parsed JSON dictionary
    """
    # Remove markdown code blocks if present
    text = response_text.strip()
    
    # Remove ```json and ``` markers
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    
    if text.endswith("```"):
        text = text[:-3]
    
    text = text.strip()
    
    # Parse JSON
    return json.loads(text)


def _get_changed_files(repo_path: str) -> Dict[str, List[str]]:
    """
    Get all staged and unstaged changed files using gitpython.
    
    Args:
        repo_path: Path to the repository
        
    Returns:
        Dictionary with 'staged' and 'unstaged' file lists
    """
    try:
        repo = git.Repo(repo_path)
        
        # Get staged files (added to index)
        staged_files = [item.a_path for item in repo.index.diff("HEAD")]
        
        # Get unstaged files (modified but not staged)
        unstaged_files = [item.a_path for item in repo.index.diff(None)]
        
        # Get untracked files
        untracked_files = repo.untracked_files
        
        return {
            "staged": staged_files,
            "unstaged": unstaged_files,
            "untracked": list(untracked_files)
        }
    except Exception as e:
        return {
            "staged": [],
            "unstaged": [],
            "untracked": [],
            "error": str(e)
        }


def _is_high_frequency_file(file_path: str, repo_path: str) -> bool:
    """
    Check if a file has been modified 3+ times in recent history.
    
    Args:
        file_path: Path to the file
        repo_path: Path to the repository
        
    Returns:
        True if file is high-frequency (3+ modifications)
    """
    try:
        history = get_git_history(repo_path)
        most_modified = history.get("most_modified_files", [])
        
        for file_info in most_modified:
            if file_info.get("file") == file_path and file_info.get("count", 0) >= 3:
                return True
        
        return False
    except Exception:
        return False


def _analyze_file_criticality(file_path: str, graph: Dict) -> Dict:
    """
    Analyze if a file is critical based on dependency graph.
    
    Args:
        file_path: Path to the file
        graph: Dependency graph
        
    Returns:
        Dictionary with criticality info
    """
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    
    # Find the node for this file
    file_node = None
    for node in nodes:
        if node["id"] == file_path:
            file_node = node
            break
    
    if not file_node:
        return {
            "is_critical": False,
            "has_dependents": False,
            "dependent_count": 0,
            "risk_level": "LOW"
        }
    
    # Count dependents (files that depend on this file)
    dependent_count = sum(1 for edge in edges if edge["target"] == file_path)
    
    return {
        "is_critical": file_node.get("risk") == "HIGH",
        "has_dependents": dependent_count > 0,
        "dependent_count": dependent_count,
        "risk_level": file_node.get("risk", "LOW")
    }


async def analyze_before_push(repo_path: str) -> dict:
    """
    Analyze repository before push to identify risks and missing items.
    
    Args:
        repo_path: Path to the repository
        
    Returns:
        Dictionary with status, risks, missing items, recommendation, and safe_to_push flag
        Format: {
            "status": "good"|"warning"|"danger",
            "risks": ["Risk 1", "Risk 2"],
            "missing": ["Missing tests", "Missing docs"],
            "recommendation": "Detailed recommendation",
            "safe_to_push": boolean
        }
    """
    try:
        # Get changed files
        changed_files_info = _get_changed_files(repo_path)
        all_changed = (
            changed_files_info.get("staged", []) + 
            changed_files_info.get("unstaged", []) + 
            changed_files_info.get("untracked", [])
        )
        
        if not all_changed:
            return {
                "status": "good",
                "risks": [],
                "missing": [],
                "recommendation": "No changes detected. Nothing to push.",
                "safe_to_push": True
            }
        
        # Scan repository for dependency graph
        graph = scan_repository(repo_path)
        
        # Analyze each changed file
        file_analysis = []
        for file_path in all_changed:
            is_high_freq = _is_high_frequency_file(file_path, repo_path)
            criticality = _analyze_file_criticality(file_path, graph)
            
            file_analysis.append({
                "file": file_path,
                "is_high_frequency": is_high_freq,
                "is_critical": criticality["is_critical"],
                "has_dependents": criticality["has_dependents"],
                "dependent_count": criticality["dependent_count"],
                "risk_level": criticality["risk_level"]
            })
        
        # Send to watsonx.ai for analysis
        model = _get_model_inference()
        
        prompt = f"""You are a code safety analyzer. Analyze the following changes before a Git push.

Changed Files Analysis:
{json.dumps(file_analysis, indent=2)}

Dependency Graph Summary:
- Total nodes: {len(graph.get('nodes', []))}
- Total edges: {len(graph.get('edges', []))}

Evaluate:
1. Are there risks in pushing these changes?
2. What could break?
3. What's missing (tests, documentation, etc.)?

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{{
  "status": "good",
  "risks": ["Risk description 1", "Risk description 2"],
  "missing": ["Missing item 1", "Missing item 2"],
  "recommendation": "Detailed recommendation for the developer",
  "safe_to_push": true
}}

Status should be:
- "good" if changes are safe
- "warning" if there are minor concerns
- "danger" if there are critical issues

safe_to_push should be false only if status is "danger"."""

        response = model.generate_text(prompt=prompt)
        result = _extract_json_from_response(response)
        
        # Add changed files info to result
        result["changed_files"] = {
            "staged": changed_files_info.get("staged", []),
            "unstaged": changed_files_info.get("unstaged", []),
            "untracked": changed_files_info.get("untracked", [])
        }
        
        return result
        
    except json.JSONDecodeError as e:
        return {
            "status": "warning",
            "risks": [f"Failed to parse AI response: {str(e)}"],
            "missing": [],
            "recommendation": "Unable to complete analysis. Please review changes manually.",
            "safe_to_push": False
        }
    except Exception as e:
        return {
            "status": "danger",
            "risks": [f"Analysis failed: {str(e)}"],
            "missing": [],
            "recommendation": "Error during analysis. Please check repository state and try again.",
            "safe_to_push": False
        }


async def analyze_merge_conflicts(repo_path: str, target_branch: str) -> dict:
    """
    Analyze potential merge conflicts between current branch and target branch.
    
    Args:
        repo_path: Path to the repository
        target_branch: Name of the target branch to merge into
        
    Returns:
        Dictionary with conflicts, severity, resolution steps, and safe_to_merge flag
        Format: {
            "conflicts": [{"file": "path", "type": "content"|"structural", "description": "..."}],
            "severity": "low"|"medium"|"high",
            "resolution_steps": ["Step 1", "Step 2"],
            "safe_to_merge": boolean
        }
    """
    try:
        repo = git.Repo(repo_path)
        
        # Get current branch
        current_branch = repo.active_branch.name
        
        # Get files modified in current branch
        try:
            current_branch_files = set()
            for commit in repo.iter_commits(f"{target_branch}..{current_branch}"):
                for item in commit.stats.files.keys():
                    current_branch_files.add(item)
        except Exception:
            current_branch_files = set()
        
        # Get files modified in target branch
        try:
            target_branch_files = set()
            for commit in repo.iter_commits(f"{current_branch}..{target_branch}"):
                for item in commit.stats.files.keys():
                    target_branch_files.add(item)
        except Exception:
            target_branch_files = set()
        
        # Find files modified in both branches (potential conflicts)
        conflicting_files = list(current_branch_files & target_branch_files)
        
        if not conflicting_files:
            return {
                "conflicts": [],
                "severity": "low",
                "resolution_steps": ["No conflicts detected. Merge should be safe."],
                "safe_to_merge": True,
                "current_branch": current_branch,
                "target_branch": target_branch
            }
        
        # Get dependency graph for context
        graph = scan_repository(repo_path)
        
        # Prepare conflict analysis
        conflict_info = []
        for file_path in conflicting_files:
            criticality = _analyze_file_criticality(file_path, graph)
            conflict_info.append({
                "file": file_path,
                "risk_level": criticality["risk_level"],
                "has_dependents": criticality["has_dependents"],
                "dependent_count": criticality["dependent_count"]
            })
        
        # Send to watsonx.ai for analysis
        model = _get_model_inference()
        
        prompt = f"""You are a merge conflict analyzer. Analyze potential conflicts between branches.

Current Branch: {current_branch}
Target Branch: {target_branch}

Files Modified in Both Branches:
{json.dumps(conflict_info, indent=2)}

Predict:
1. Potential merge conflicts and their severity
2. How to resolve each conflict
3. Overall merge safety

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{{
  "conflicts": [
    {{
      "file": "path/to/file",
      "type": "content",
      "description": "Conflicting changes in function X"
    }}
  ],
  "severity": "medium",
  "resolution_steps": [
    "Review changes in file X",
    "Manually merge conflicting sections",
    "Run tests after merge"
  ],
  "safe_to_merge": true
}}

Severity levels:
- "low": Minor conflicts, easy to resolve
- "medium": Moderate conflicts, requires careful review
- "high": Critical conflicts, high risk of breaking changes

safe_to_merge should be false if severity is "high"."""

        response = model.generate_text(prompt=prompt)
        result = _extract_json_from_response(response)
        
        # Add branch info to result
        result["current_branch"] = current_branch
        result["target_branch"] = target_branch
        result["conflicting_files"] = conflicting_files
        
        return result
        
    except json.JSONDecodeError as e:
        return {
            "conflicts": [],
            "severity": "high",
            "resolution_steps": [f"Failed to parse AI response: {str(e)}"],
            "safe_to_merge": False,
            "error": "JSON parsing error"
        }
    except Exception as e:
        return {
            "conflicts": [],
            "severity": "high",
            "resolution_steps": [f"Analysis failed: {str(e)}"],
            "safe_to_merge": False,
            "error": str(e)
        }


# Alias for backward compatibility
analyze_push_safety = analyze_before_push

# Made with Bob