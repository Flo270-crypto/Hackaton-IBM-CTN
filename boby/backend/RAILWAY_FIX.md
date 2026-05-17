# 🔧 Railway Deployment Fix - Demo Repo Path Issue

## Problème

L'erreur `Repository path not found: /demo-repo` se produit car Railway déploie uniquement le contenu du dossier `backend/`, et le `demo-repo` se trouve au niveau parent (`boby/demo-repo`).

## Solution

### Option 1 : Configurer Railway pour déployer depuis `boby/` (Recommandé)

Cette solution permet à Railway d'accéder au `demo-repo` en déployant depuis le dossier parent.

#### Étapes dans Railway Dashboard :

1. **Aller dans Settings → Deploy**
2. **Root Directory** : Changer de `boby/backend` à `boby`
3. **Build Command** : `cd backend && pip install -r requirements.txt`
4. **Start Command** : `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

Le fichier [`railway.json`](railway.json) a déjà été mis à jour avec ces commandes.

#### Structure attendue sur Railway :
```
/app/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
└── demo-repo/
    └── src/
        └── ...
```

### Option 2 : Copier demo-repo dans backend/ (Alternative)

Si Railway ne supporte pas le changement de Root Directory :

```bash
# Dans votre repo local
cp -r boby/demo-repo boby/backend/demo-repo
git add boby/backend/demo-repo
git commit -m "Add demo-repo to backend for Railway deployment"
git push
```

Puis modifier `resolve_repo_path` dans `main.py` :

```python
def resolve_repo_path(repo_path: str) -> str:
    path = Path(repo_path)
    
    if path.is_absolute():
        return str(path.resolve())
    
    backend_dir = Path(__file__).parent
    
    # Pour Railway : demo-repo est dans backend/
    if repo_path.startswith('./'):
        resolved_path = backend_dir / repo_path[2:]
    else:
        resolved_path = backend_dir / repo_path
    
    return str(resolved_path.resolve())
```

### Option 3 : Utiliser une variable d'environnement

Ajouter une variable d'environnement dans Railway :

```
DEMO_REPO_PATH=/app/demo-repo
```

Puis modifier le code pour utiliser cette variable :

```python
import os

def resolve_repo_path(repo_path: str) -> str:
    # Si c'est le demo-repo, utiliser la variable d'environnement
    if repo_path in ['./demo-repo', 'demo-repo']:
        demo_path = os.getenv('DEMO_REPO_PATH')
        if demo_path and os.path.exists(demo_path):
            return demo_path
    
    # Sinon, logique normale
    # ... reste du code
```

## Vérification

Après le déploiement, testez avec :

```bash
curl https://your-railway-app.railway.app/history \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "./demo-repo"}'
```

Vous devriez recevoir l'historique Git au lieu d'une erreur.

## Logs de débogage

Pour vérifier le chemin résolu, ajoutez des logs dans `main.py` :

```python
@app.post("/merge-intelligence")
async def merge_intelligence_check(request: MergeIntelligenceRequest):
    repo_path = resolve_repo_path(request.repo_path)
    print(f"🔍 Resolved path: {repo_path}")
    print(f"📁 Path exists: {os.path.exists(repo_path)}")
    print(f"📂 Is directory: {os.path.isdir(repo_path)}")
    
    if not os.path.exists(repo_path):
        # Liste le contenu du répertoire parent pour debug
        parent = Path(repo_path).parent
        print(f"📋 Parent directory contents: {list(parent.iterdir())}")
        raise HTTPException(status_code=404, detail=f"Repository path not found: {repo_path}")
    # ... reste du code
```

## Recommandation

**Option 1** est la meilleure solution car :
- ✅ Garde la structure du projet propre
- ✅ Pas de duplication de fichiers
- ✅ Fonctionne pour tous les endpoints
- ✅ Facile à maintenir

Après avoir appliqué la solution, redéployez sur Railway et testez tous les endpoints.

---

**Note** : Si vous utilisez Railway avec un monorepo, assurez-vous que le fichier `railway.json` est bien lu depuis le bon emplacement.