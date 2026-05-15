"""
Simple test script to verify the Boby backend API endpoints.
Run this after starting the server with: python main.py
"""

import httpx
import json
from pathlib import Path


BASE_URL = "http://localhost:8000"


def test_health_check():
    """Test the root endpoint"""
    print("Testing health check endpoint...")
    response = httpx.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.status_code == 200


def test_analyze(repo_path: str):
    """Test the /analyze endpoint"""
    print(f"Testing /analyze endpoint with repo: {repo_path}...")
    
    payload = {"repo_path": repo_path}
    response = httpx.post(f"{BASE_URL}/analyze", json=payload, timeout=30.0)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data['nodes'])} nodes and {len(data['edges'])} edges")
        if data['nodes']:
            print(f"Sample node: {data['nodes'][0]}")
        if data['edges']:
            print(f"Sample edge: {data['edges'][0]}")
    else:
        print(f"Error: {response.text}")
    print()
    return response.status_code == 200, response.json() if response.status_code == 200 else None


def test_impact(graph):
    """Test the /impact endpoint"""
    print("Testing /impact endpoint...")
    
    if not graph or not graph.get('nodes'):
        print("Skipping - no graph data available\n")
        return False
    
    # Use the first node as the changed file
    changed_file = graph['nodes'][0]['id']
    
    payload = {
        "changed_file": changed_file,
        "graph": graph
    }
    
    response = httpx.post(f"{BASE_URL}/impact", json=payload, timeout=30.0)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data['affected_modules'])} affected modules")
        if data['affected_modules']:
            print(f"Sample affected module: {data['affected_modules'][0]}")
    else:
        print(f"Error: {response.text}")
    print()
    return response.status_code == 200


def test_checklist():
    """Test the /checklist endpoint"""
    print("Testing /checklist endpoint...")
    
    payload = {
        "repo_context": "Repository with tests and documentation"
    }
    
    response = httpx.post(f"{BASE_URL}/checklist", json=payload, timeout=30.0)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Done: {len(data['done'])} items")
        print(f"Todo: {len(data['todo'])} items")
        print(f"Suggestions: {len(data['suggestions'])} items")
    else:
        print(f"Error: {response.text}")
    print()
    return response.status_code == 200


def test_history(repo_path: str):
    """Test the /history endpoint"""
    print(f"Testing /history endpoint with repo: {repo_path}...")
    
    payload = {"repo_path": repo_path}
    response = httpx.post(f"{BASE_URL}/history", json=payload, timeout=30.0)
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data['commits'])} commits")
        print(f"Most modified files: {len(data['most_modified_files'])}")
        if data['commits']:
            print(f"Latest commit: {data['commits'][0]['message']}")
    else:
        print(f"Error: {response.text}")
    print()
    return response.status_code == 200


def main():
    """Run all tests"""
    print("=" * 60)
    print("Boby Backend API Tests")
    print("=" * 60)
    print()
    
    # Use the demo-repo for testing
    demo_repo = str(Path(__file__).parent.parent / "demo-repo")
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Analyze
    success, graph = test_analyze(demo_repo)
    results.append(("Analyze", success))
    
    # Test 3: Impact (requires graph from analyze)
    if graph:
        results.append(("Impact", test_impact(graph)))
    else:
        results.append(("Impact", False))
    
    # Test 4: Checklist
    results.append(("Checklist", test_checklist()))
    
    # Test 5: History
    results.append(("History", test_history(demo_repo)))
    
    # Summary
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    for name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{name:20} {status}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{total} tests passed")


if __name__ == "__main__":
    try:
        main()
    except httpx.ConnectError:
        print("Error: Could not connect to the server.")
        print("Make sure the server is running with: python main.py")
    except Exception as e:
        print(f"Error: {e}")

# Made with Bob
