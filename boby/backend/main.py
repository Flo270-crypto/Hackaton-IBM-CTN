from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from pathlib import Path

from analyzer import scan_repository
from git_tracker import get_git_history


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
    repo_context: str


class HistoryRequest(BaseModel):
    repo_path: str


class AnalyzeResponse(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]


class ImpactResponse(BaseModel):
    affected_modules: List[Dict]


class ChecklistResponse(BaseModel):
    done: List[str]
    todo: List[str]
    suggestions: List[str]


class HistoryResponse(BaseModel):
    commits: List[Dict]
    most_modified_files: List[Dict]


@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "service": "Boby",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_repository(request: AnalyzeRequest):
    """
    Analyzes a repository and returns a dependency graph.
    
    Args:
        request: Contains repo_path
        
    Returns:
        Dependency graph with nodes and edges
    """
    repo_path = request.repo_path
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        graph = scan_repository(repo_path)
        return AnalyzeResponse(
            nodes=graph["nodes"],
            edges=graph["edges"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing repository: {str(e)}")


@app.post("/impact", response_model=ImpactResponse)
def analyze_impact(request: ImpactRequest):
    """
    Analyzes the impact of changes to a file.
    
    Args:
        request: Contains changed_file and graph
        
    Returns:
        List of affected modules with risk levels
    """
    changed_file = request.changed_file
    graph = request.graph
    
    try:
        affected_modules = calculate_impact(changed_file, graph)
        return ImpactResponse(affected_modules=affected_modules)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating impact: {str(e)}")


@app.post("/checklist", response_model=ChecklistResponse)
def generate_checklist(request: ChecklistRequest):
    """
    Generates a testing checklist based on repository context.
    
    Args:
        request: Contains repo_context
        
    Returns:
        Checklist with done, todo, and suggestions
    """
    repo_context = request.repo_context
    
    try:
        checklist = create_checklist(repo_context)
        return ChecklistResponse(
            done=checklist["done"],
            todo=checklist["todo"],
            suggestions=checklist["suggestions"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating checklist: {str(e)}")


@app.post("/history", response_model=HistoryResponse)
def get_repository_history(request: HistoryRequest):
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
        
        return HistoryResponse(
            commits=history["commits"],
            most_modified_files=history["most_modified_files"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting repository history: {str(e)}")


# Helper Functions

def calculate_impact(changed_file: str, graph: Dict) -> List[Dict]:
    """
    Calculates which modules are affected by changes to a file.
    
    Args:
        changed_file: Path to the changed file
        graph: Dependency graph
        
    Returns:
        List of affected modules with risk levels
    """
    affected = []
    edges = graph.get("edges", [])
    nodes = graph.get("nodes", [])
    
    # Create a map of node IDs to nodes
    node_map = {node["id"]: node for node in nodes}
    
    # Find all files that depend on the changed file (direct dependencies)
    direct_dependents = set()
    for edge in edges:
        if edge["target"] == changed_file:
            direct_dependents.add(edge["source"])
    
    # Find indirect dependencies (files that depend on direct dependents)
    indirect_dependents = set()
    for dependent in direct_dependents:
        for edge in edges:
            if edge["target"] == dependent and edge["source"] not in direct_dependents:
                indirect_dependents.add(edge["source"])
    
    # Add the changed file itself
    if changed_file in node_map:
        affected.append({
            "file": changed_file,
            "risk": "HIGH",
            "reason": "Modified file",
            "type": "changed"
        })
    
    # Add direct dependents
    for file_id in direct_dependents:
        if file_id in node_map:
            node = node_map[file_id]
            affected.append({
                "file": file_id,
                "risk": "HIGH" if node.get("risk") == "HIGH" else "MEDIUM",
                "reason": "Direct dependency",
                "type": "direct"
            })
    
    # Add indirect dependents
    for file_id in indirect_dependents:
        if file_id in node_map:
            node = node_map[file_id]
            affected.append({
                "file": file_id,
                "risk": "MEDIUM" if node.get("risk") == "HIGH" else "LOW",
                "reason": "Indirect dependency",
                "type": "indirect"
            })
    
    return affected


def create_checklist(repo_context: str) -> Dict:
    """
    Creates a testing checklist based on repository context.
    
    Args:
        repo_context: Context about the repository
        
    Returns:
        Dictionary with done, todo, and suggestions lists
    """
    # Parse repo context to generate intelligent checklist
    # This is a simplified version - can be enhanced with AI/ML
    
    done = []
    todo = []
    suggestions = []
    
    # Basic checklist items based on common patterns
    if "test" in repo_context.lower():
        done.append("Test files exist")
    else:
        todo.append("Add test coverage")
        suggestions.append("Consider adding unit tests for critical modules")
    
    if "readme" in repo_context.lower():
        done.append("Documentation exists")
    else:
        todo.append("Add README documentation")
        suggestions.append("Document API endpoints and setup instructions")
    
    # Standard testing checklist
    todo.extend([
        "Run unit tests",
        "Test API endpoints",
        "Verify error handling",
        "Check edge cases",
        "Review code changes"
    ])
    
    suggestions.extend([
        "Test with different input scenarios",
        "Verify backward compatibility",
        "Check performance impact",
        "Review security implications",
        "Update integration tests"
    ])
    
    return {
        "done": done,
        "todo": todo,
        "suggestions": suggestions
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Made with Bob
