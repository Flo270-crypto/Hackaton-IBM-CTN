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
from cache_manager import cache_manager
from github_cloner import github_cloner


app = FastAPI(title="Boby - Code Analysis Backend")

# Configure CORS for frontend access
# Get allowed origins from environment variable
# In production, set ALLOWED_ORIGINS to your Vercel frontend URL
# Example: ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175")

# Parse origins from comma-separated string
if allowed_origins_env == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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


class PushGuardianRequest(BaseModel):
    repo_path: str


class MergeIntelligenceRequest(BaseModel):
    repo_path: str
    target_branch: str


class CloneAndAnalyzeRequest(BaseModel):
    github_url: str
    force_reclone: Optional[bool] = False
    skip_ai: Optional[bool] = False  # Skip AI analysis for faster response




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
    # Check cache first for demo repo
    cached = cache_manager.get_cached("analyze", request.repo_path)
    if cached:
        print(f"🚀 Returning cached result for analyze endpoint")
        return cached
    
    repo_path = resolve_repo_path(request.repo_path)
    
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
        result = {
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "ai_analysis": ai_analysis
        }
        
        # Cache result if demo repo
        cache_manager.set_cached("analyze", request.repo_path, result)
        
        return result
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
    # Check cache first for demo repo
    cached = cache_manager.get_cached("checklist", request.repo_context)
    if cached:
        print(f"🚀 Returning cached result for checklist endpoint")
        return cached
    
    repo_context = request.repo_context
    
    try:
        # Get AI-generated checklist
        checklist = await bob_client.generate_checklist(repo_context)
        
        # Cache result if demo repo
        cache_manager.set_cached("checklist", request.repo_context, checklist)
        
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
    # Check cache first for demo repo
    cached = cache_manager.get_cached("history", request.repo_path)
    if cached:
        print(f"🚀 Returning cached result for history endpoint")
        return cached
    
    repo_path = resolve_repo_path(request.repo_path)
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    try:
        history = get_git_history(repo_path)
        
        if "error" in history:
            raise HTTPException(status_code=400, detail=history["error"])
        
        result = {
            "commits": history["commits"],
            "most_modified_files": history["most_modified_files"]
        }
        
        # Cache result if demo repo
        cache_manager.set_cached("history", request.repo_path, result)
        
        return result
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
    # Check cache first for demo repo
    cached = cache_manager.get_cached("push-guardian", request.repo_path)
    if cached:
        print(f"🚀 Returning cached result for push-guardian endpoint")
        return cached
    
    repo_path = resolve_repo_path(request.repo_path)
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        result = await push_guardian.analyze_before_push(repo_path)
        
        # Cache result if demo repo
        cache_manager.set_cached("push-guardian", request.repo_path, result)
        
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
    # Check cache first for demo repo
    cache_key = f"{request.repo_path}_{request.target_branch}"
    cached = cache_manager.get_cached("merge-intelligence", cache_key)
    if cached:
        print(f"🚀 Returning cached result for merge-intelligence endpoint")
        return cached
    
    repo_path = resolve_repo_path(request.repo_path)
    target_branch = request.target_branch
    
    # Validate path
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    
    if not os.path.isdir(repo_path):
        raise HTTPException(status_code=400, detail=f"Path is not a directory: {repo_path}")
    
    try:
        result = await push_guardian.analyze_merge_conflicts(repo_path, target_branch)
        
        # Cache result if demo repo
        cache_manager.set_cached("merge-intelligence", cache_key, result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing merge: {str(e)}")

@app.post("/clone-and-analyze")
async def clone_and_analyze_repository(request: CloneAndAnalyzeRequest):
    """
    Clone a GitHub repository and analyze it.
    
    Args:
        request: Contains github_url and optional force_reclone flag
        
    Returns:
        Clone status and analysis results (same format as /analyze endpoint)
    """
    try:
        # Clone the repository
        print(f"🔄 Cloning repository: {request.github_url}")
        clone_result = github_cloner.clone_repository(
            request.github_url, 
            force_reclone=request.force_reclone
        )
        
        # Check if clone was successful
        if clone_result["status"] == "error":
            raise HTTPException(
                status_code=400, 
                detail=f"{clone_result['error']}: {clone_result['message']}"
            )
        
        # Get the local path
        repo_path = clone_result["path"]
        
        # Cleanup old repos to save disk space
        github_cloner.cleanup_old_repos(max_repos=10)
        
        # Analyze the cloned repository (basic graph analysis - fast)
        print(f"🔍 Analyzing cloned repository: {repo_path}")
        graph = scan_repository(repo_path)
        
        # AI analysis is optional and can be skipped for faster response
        ai_analysis = None
        if not request.skip_ai:
            try:
                file_tree = build_file_tree(repo_path)
                ai_analysis = await bob_client.analyze_architecture(file_tree, graph)
                print(f"✅ AI analysis completed")
            except Exception as e:
                print(f"⚠️ AI analysis failed (non-blocking): {str(e)}")
                ai_analysis = {"error": "AI analysis unavailable", "message": str(e)}
        else:
            print(f"⚡ Skipping AI analysis for faster response")
            ai_analysis = {"skipped": True, "message": "AI analysis skipped for performance"}
        
        # Return combined result
        return {
            "clone_info": {
                "status": clone_result["status"],
                "owner": clone_result["owner"],
                "repo": clone_result["repo"],
                "message": clone_result["message"]
            },
            "analysis": {
                "nodes": graph["nodes"],
                "edges": graph["edges"],
                "ai_analysis": ai_analysis
            },
            "repo_path": repo_path
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error cloning and analyzing repository: {str(e)}"
        )



# Helper Functions

@app.post("/warm-cache")
async def warm_cache():
    """
    Warms up the cache by running all analyses on the demo repository.
    This endpoint should be called once to pre-populate the cache.
    
    Returns:
        Status message with details of cached endpoints
    """
    demo_repo_path = './demo-repo'
    repo_path = resolve_repo_path(demo_repo_path)
    
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail=f"Demo repository not found: {repo_path}")
    
    results = {
        "status": "success",
        "cached_endpoints": []
    }
    
    try:
        # 1. Analyze endpoint
        print("🔥 Warming cache: analyze endpoint...")
        graph = scan_repository(repo_path)
        file_tree = build_file_tree(repo_path)
        ai_analysis = await bob_client.analyze_architecture(file_tree, graph)
        analyze_result = {
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "ai_analysis": ai_analysis
        }
        cache_manager.warm_cache("analyze", analyze_result)
        results["cached_endpoints"].append("analyze")
        
        # 2. History endpoint
        print("🔥 Warming cache: history endpoint...")
        history = get_git_history(repo_path)
        history_result = {
            "commits": history["commits"],
            "most_modified_files": history["most_modified_files"]
        }
        cache_manager.warm_cache("history", history_result)
        results["cached_endpoints"].append("history")
        
        # 3. Push Guardian endpoint
        print("🔥 Warming cache: push-guardian endpoint...")
        push_result = await push_guardian.analyze_before_push(repo_path)
        cache_manager.warm_cache("push-guardian", push_result)
        results["cached_endpoints"].append("push-guardian")
        
        # 4. Merge Intelligence endpoint (with main branch)
        print("🔥 Warming cache: merge-intelligence endpoint...")
        merge_result = await push_guardian.analyze_merge_conflicts(repo_path, "main")
        cache_manager.warm_cache("merge-intelligence", merge_result)
        results["cached_endpoints"].append("merge-intelligence")
        
        # 5. Checklist endpoint
        print("🔥 Warming cache: checklist endpoint...")
        checklist_result = await bob_client.generate_checklist(demo_repo_path)
        cache_manager.warm_cache("checklist", checklist_result)
        results["cached_endpoints"].append("checklist")
        
        # Save cache to disk
        cache_manager.save_cache()
        
        print("✅ Cache warming complete!")
        results["message"] = "Cache successfully warmed for demo repository"
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error warming cache: {str(e)}")


def resolve_repo_path(repo_path: str) -> str:
    """
    Resolve repository path - accepts both absolute and relative paths.
    Works both locally (boby/backend/) and on Railway (where demo-repo is copied to backend/).
    
    Args:
        repo_path: Path provided by frontend (absolute or relative)
        
    Returns:
        Absolute path to the repository
    """
    path = Path(repo_path)
    
    # If it's already an absolute path, use it directly
    if path.is_absolute():
        return str(path.resolve())
    
    # Get the backend directory (where this script is located)
    backend_dir = Path(__file__).parent
    
    # For demo-repo, check if it exists in backend directory first (Railway deployment)
    if repo_path in ['./demo-repo', 'demo-repo']:
        # Try backend/demo-repo first (Railway)
        railway_path = backend_dir / 'demo-repo'
        if railway_path.exists():
            return str(railway_path.resolve())
        
        # Fall back to ../demo-repo (local development)
        local_path = backend_dir.parent / 'demo-repo'
        if local_path.exists():
            return str(local_path.resolve())
    
    # Go up one level to the boby directory for other paths
    boby_dir = backend_dir.parent
    
    # If path starts with './', resolve it relative to boby directory
    if repo_path.startswith('./'):
        resolved_path = boby_dir / repo_path[2:]
    elif repo_path.startswith('../'):
        resolved_path = boby_dir / repo_path
    else:
        # Assume it's relative to boby directory
        resolved_path = boby_dir / repo_path
    
    return str(resolved_path.resolve())


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
        exclude_dirs = {
            '.git', 'node_modules', '__pycache__', 'venv', '.venv', 'dist', 'build', 
            '.next', '.cache', 'coverage', '.idea', '.vscode'
        }
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
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
