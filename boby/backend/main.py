from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from pathlib import Path

from analyzer import scan_repository
from git_tracker import get_git_history
import bob_client
import push_guardian


app = FastAPI(title="Boby - Code Analysis Backend")

# Configure CORS for localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class AnalyzeRequest(BaseModel):
    repo_path: str


class ImpactRequest(BaseModel):
    changed_file: str
    graph: Dict


class ChecklistRequest(BaseModel):
    repo_context: Dict


class HistoryRequest(BaseModel):
    repo_path: str


class PushGuardianRequest(BaseModel):
    repo_path: str


class MergeIntelligenceRequest(BaseModel):
    repo_path: str
    target_branch: str




@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "service": "Boby",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/analyze")
async def analyze_repository(request: AnalyzeRequest):
    """
    Analyzes a repository and returns an enriched dependency graph with AI insights.
    
    Args:
        request: Contains repo_path
        
    Returns:
        Dependency graph with nodes, edges, and AI-generated critical file analysis
    """
    repo_path = request.repo_path
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        # Scan repository to get dependency graph
        graph = scan_repository(repo_path)
        
        # Build file tree
        file_tree = build_file_tree(repo_path)
        
        # Get AI analysis of architecture
        ai_analysis = await bob_client.analyze_architecture(file_tree, graph)
        
        # Return enriched result
        return {
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "ai_analysis": ai_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing repository: {str(e)}")


@app.post("/impact")
async def analyze_impact(request: ImpactRequest):
    """
    Analyzes the impact of changes to a file using AI.
    
    Args:
        request: Contains changed_file and graph
        
    Returns:
        AI-generated impact analysis with affected modules and recommendations
    """
    changed_file = request.changed_file
    graph = request.graph
    
    try:
        # Get AI-powered impact prediction
        impact_result = await bob_client.predict_impact(changed_file, graph)
        return impact_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating impact: {str(e)}")


@app.post("/checklist")
async def generate_checklist(request: ChecklistRequest):
    """
    Generates an AI-powered testing checklist based on repository context.
    
    Args:
        request: Contains repo_context
        
    Returns:
        AI-generated checklist with done, todo, and suggestions
    """
    repo_context = request.repo_context
    
    try:
        # Get AI-generated checklist
        checklist = await bob_client.generate_checklist(repo_context)
        return checklist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating checklist: {str(e)}")


@app.post("/history")
async def get_repository_history(request: HistoryRequest):
    """
    Gets Git history for a repository.
    
    Args:
        request: Contains repo_path
        
    Returns:
        Last 10 commits and most modified files
    """
    repo_path = request.repo_path
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    try:
        history = get_git_history(repo_path)
        
        if "error" in history:
            raise HTTPException(status_code=400, detail=history["error"])
        
        return {
            "commits": history["commits"],
            "most_modified_files": history["most_modified_files"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting repository history: {str(e)}")


@app.post("/push-guardian")
async def push_guardian_check(request: PushGuardianRequest):
    """
    Analyzes repository before push to identify risks and missing items.
    
    Args:
        request: Contains repo_path
        
    Returns:
        AI-powered analysis with status, risks, missing items, and recommendation
    """
    repo_path = request.repo_path
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        result = await push_guardian.analyze_before_push(repo_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing push: {str(e)}")


@app.post("/merge-intelligence")
async def merge_intelligence_check(request: MergeIntelligenceRequest):
    """
    Analyzes potential merge conflicts between current branch and target branch.
    
    Args:
        request: Contains repo_path and target_branch
        
    Returns:
        AI-powered analysis with conflicts, severity, resolution steps, and merge safety
    """
    repo_path = request.repo_path
    target_branch = request.target_branch
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        result = await push_guardian.analyze_merge_conflicts(repo_path, target_branch)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing merge: {str(e)}")


# Helper Functions

def build_file_tree(repo_path: str) -> Dict:
    """
    Builds a file tree structure for the repository.
    
    Args:
        repo_path: Path to the repository root
        
    Returns:
        Dictionary representing the file tree structure
    """
    file_tree = {
        "name": os.path.basename(repo_path),
        "path": repo_path,
        "type": "directory",
        "children": []
    }
    
    # Supported file extensions
    extensions = {'.js', '.ts', '.jsx', '.tsx', '.py', '.json', '.md'}
    
    # Walk through the repository
    for root, dirs, files in os.walk(repo_path):
        # Skip common directories
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', 'venv', '.venv', 'dist', 'build'}]
        
        relative_root = os.path.relpath(root, repo_path)
        if relative_root == '.':
            relative_root = ''
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix in extensions:
                relative_path = str(file_path.relative_to(repo_path))
                file_tree["children"].append({
                    "name": file,
                    "path": relative_path,
                    "type": "file",
                    "extension": file_path.suffix
                })
    
    return file_tree


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Made with Bob
