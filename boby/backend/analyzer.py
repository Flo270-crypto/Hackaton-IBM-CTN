import os
import re
from pathlib import Path
from typing import Dict, List, Set, Optional


def scan_repository(repo_path: str) -> Dict:
    """
    Scans a repository recursively and builds a dependency graph.
    
    Args:
        repo_path: Path to the repository root
        
    Returns:
        Dictionary with nodes and edges representing the dependency graph
    """
    nodes = []
    edges = []
    file_imports = {}
    all_source_files = []  # Track all files found
    
    # Supported file extensions
    extensions = {'.js', '.ts', '.jsx', '.tsx', '.py'}
    
    # Walk through the repository
    for root, dirs, files in os.walk(repo_path):
        # Skip common directories
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', 'venv', '.venv', 'dist', 'build'}]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix in extensions:
                relative_path = str(file_path.relative_to(repo_path))
                all_source_files.append(relative_path)
                imports = extract_imports(file_path, file_path.suffix)
                file_imports[relative_path] = imports
    
    # Build nodes for ALL files found
    for file_path in all_source_files:
        node_id = file_path
        label = Path(file_path).name
        risk = calculate_risk(file_path, file_imports)
        
        nodes.append({
            "id": node_id,
            "label": label,
            "risk": risk
        })
    
    # Build edges
    for source_file, imports in file_imports.items():
        for imported_file in imports:
            # Try to resolve the import to an actual file
            resolved = resolve_import(source_file, imported_file, list(file_imports.keys()))
            if resolved:
                edges.append({
                    "source": source_file,
                    "target": resolved
                })
    
    return {
        "nodes": nodes,
        "edges": edges
    }


def extract_imports(file_path: Path, extension: str) -> Set[str]:
    """
    Extracts import statements from a file using regex.
    
    Args:
        file_path: Path to the file
        extension: File extension
        
    Returns:
        Set of imported module names
    """
    imports = set()
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
            if extension == '.py':
                # Python imports: import x, from x import y
                patterns = [
                    r'^\s*import\s+([a-zA-Z0-9_\.]+)',
                    r'^\s*from\s+([a-zA-Z0-9_\.]+)\s+import'
                ]
            else:
                # JavaScript/TypeScript imports
                patterns = [
                    r'import\s+.*?\s+from\s+[\'"]([^\'"]+)[\'"]',
                    r'require\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)',
                    r'import\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)'
                ]
            
            for pattern in patterns:
                matches = re.finditer(pattern, content, re.MULTILINE)
                for match in matches:
                    import_path = match.group(1)
                    # Filter out external packages (node_modules, pip packages)
                    if not import_path.startswith('.') and '/' not in import_path and '\\' not in import_path:
                        continue
                    imports.add(import_path)
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return imports


def resolve_import(source_file: str, import_path: str, all_files: List[str]) -> Optional[str]:
    """
    Resolves a relative import path to an actual file in the repository.
    
    Args:
        source_file: The file containing the import
        import_path: The import path string
        all_files: List of all files in the repository
        
    Returns:
        Resolved file path or None
    """
    source_dir = str(Path(source_file).parent)
    
    # Handle relative imports
    if import_path.startswith('.'):
        # Resolve relative path
        if source_dir == '.':
            resolved_path = import_path.lstrip('./')
        else:
            resolved_path = str(Path(source_dir) / import_path)
        
        # Normalize path
        resolved_path = os.path.normpath(str(resolved_path)).replace("\\", "/")
        
        # Try different extensions
        for ext in ['', '.js', '.ts', '.jsx', '.tsx', '.py', '/index.js', '/index.ts']:
            candidate = resolved_path + ext
            if candidate in all_files:
                return candidate
    
    return None


def calculate_risk(file_path: str, file_imports: Dict[str, Set[str]]) -> str:
    """
    Calculates risk level based on number of dependencies.
    
    Args:
        file_path: Path to the file
        file_imports: Dictionary of all file imports
        
    Returns:
        Risk level: HIGH, MEDIUM, or LOW
    """
    # Count how many files depend on this file
    all_files_list = list(file_imports.keys())
    dependents = sum(1 for imports in file_imports.values() if any(
        resolve_import(source, imp, all_files_list) == file_path
        for source, imports_set in file_imports.items()
        for imp in imports_set
    ))
    
    # Count how many files this file depends on
    dependencies = len(file_imports.get(file_path, set()))
    
    total_connections = dependents + dependencies
    
    if total_connections >= 5:
        return "HIGH"
    elif total_connections >= 2:
        return "MEDIUM"
    else:
        return "LOW"

# Made with Bob
