import json
import os
from pathlib import Path
from typing import Dict, Optional, Any

CACHE_FILE = Path(__file__).parent / "cache.json"
DEMO_REPO_PATHS = ['./demo-repo', 'demo-repo', '../demo-repo']

class CacheManager:
    def __init__(self):
        self.cache: Dict[str, Any] = {}
        self.load_cache()
    
    def load_cache(self):
        """Load cache from cache.json if it exists"""
        if CACHE_FILE.exists():
            try:
                with open(CACHE_FILE, 'r') as f:
                    self.cache = json.load(f)
                print(f"✅ Cache loaded from {CACHE_FILE}")
            except Exception as e:
                print(f"⚠️ Failed to load cache: {e}")
                self.cache = {}
        else:
            print("ℹ️ No cache file found, starting with empty cache")
            self.cache = {}
    
    def save_cache(self):
        """Save cache to cache.json"""
        try:
            with open(CACHE_FILE, 'w') as f:
                json.dump(self.cache, f, indent=2)
            print(f"✅ Cache saved to {CACHE_FILE}")
        except Exception as e:
            print(f"⚠️ Failed to save cache: {e}")
    
    def is_demo_repo(self, repo_path: str) -> bool:
        """Check if the repo path is the demo repo"""
        normalized = repo_path.replace('\\', '/').strip()
        return any(normalized.endswith(demo_path) or normalized == demo_path 
                   for demo_path in DEMO_REPO_PATHS)
    
    def get_cached(self, endpoint: str, repo_path: str) -> Optional[Any]:
        """Get cached result for an endpoint if repo is demo repo"""
        if not self.is_demo_repo(repo_path):
            return None
        
        cache_key = f"demo_{endpoint}"
        return self.cache.get(cache_key)
    
    def set_cached(self, endpoint: str, repo_path: str, data: Any):
        """Cache result for an endpoint if repo is demo repo"""
        if not self.is_demo_repo(repo_path):
            return
        
        cache_key = f"demo_{endpoint}"
        self.cache[cache_key] = data
        self.save_cache()
    
    def warm_cache(self, endpoint: str, data: Any):
        """Directly set cache for demo repo (used by warm-cache endpoint)"""
        cache_key = f"demo_{endpoint}"
        self.cache[cache_key] = data
    
    def clear_cache(self):
        """Clear all cache"""
        self.cache = {}
        self.save_cache()

# Global cache manager instance
cache_manager = CacheManager()

# Made with Bob
