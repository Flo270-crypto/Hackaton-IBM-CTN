# 🧪 Guide de Test Rapide - Fonctionnalité GitHub Clone

## 🚀 Démarrage rapide

### 1. Démarrer le backend
```bash
cd boby/backend
uvicorn main:app --reload
```

Le backend démarre sur `http://localhost:8000`

### 2. Démarrer le frontend
```bash
cd boby/frontend
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### 3. Tester la fonctionnalité

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Cliquez sur l'icône Boby (bot) en bas à droite
3. Dans l'écran d'onboarding, cliquez sur "GitHub URL"
4. Entrez une URL de test : `https://github.com/expressjs/express`
5. Cliquez sur "Let's go"
6. Attendez le clone (5-15 secondes)
7. Explorez les modules d'analyse !

## 📋 URLs de test recommandées

### ✅ Petits repos (rapides, ~5 secondes)
```
https://github.com/sindresorhus/awesome
https://github.com/github/gitignore
https://github.com/h5bp/html5-boilerplate
```

### ✅ Repos moyens (~10-20 secondes)
```
https://github.com/expressjs/express
https://github.com/axios/axios
https://github.com/lodash/lodash
```

### ⚠️ Gros repos (lents, >30 secondes)
```
https://github.com/facebook/react
https://github.com/microsoft/vscode
https://github.com/nodejs/node
```

## 🔍 Test de l'API directement

### Test avec curl
```bash
# Clone et analyse
curl -X POST http://localhost:8000/clone-and-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "github_url": "https://github.com/expressjs/express",
    "force_reclone": false
  }'
```

### Réponse attendue
```json
{
  "clone_info": {
    "status": "cloned",
    "owner": "expressjs",
    "repo": "express",
    "message": "Successfully cloned expressjs/express"
  },
  "analysis": {
    "nodes": [...],
    "edges": [...],
    "ai_analysis": {...}
  },
  "repo_path": "/tmp/boby_cloned_repos/expressjs_express"
}
```

## ✅ Checklist de test

### Fonctionnalités de base
- [ ] Le widget s'ouvre correctement
- [ ] Le toggle Demo/GitHub fonctionne
- [ ] L'input GitHub URL accepte du texte
- [ ] Le bouton "Let's go" est désactivé si l'URL est vide
- [ ] Le spinner apparaît pendant le clone
- [ ] Le clone réussit pour un repo public
- [ ] L'analyse démarre après le clone
- [ ] Tous les modules sont accessibles

### Gestion d'erreurs
- [ ] URL invalide affiche une erreur
- [ ] Repo inexistant affiche "not found"
- [ ] Repo privé affiche "authentication failed"
- [ ] Les erreurs sont affichées clairement

### Performance
- [ ] Clone shallow (rapide)
- [ ] Cache fonctionne (pas de re-clone)
- [ ] Nettoyage automatique après 10 repos

## 🐛 Problèmes courants

### Le backend ne démarre pas
```bash
# Vérifier les dépendances
pip install -r requirements.txt

# Vérifier que GitPython est installé
python -c "import git; print('GitPython OK')"
```

### Le frontend ne se connecte pas au backend
```bash
# Vérifier la variable d'environnement
cat boby/frontend/.env

# Devrait contenir :
VITE_API_URL=http://localhost:8000
```

### Le clone échoue
```bash
# Vérifier la connexion internet
ping github.com

# Vérifier que Git est installé
git --version

# Tester le clone manuellement
git clone --depth 1 https://github.com/expressjs/express /tmp/test_clone
```

### Erreur "Repository not found"
- Vérifier que le repo existe sur GitHub
- Vérifier l'orthographe de l'URL
- Essayer avec un repo public connu (express, axios, etc.)

## 📊 Logs à surveiller

### Backend (terminal 1)
```
📥 Cloning https://github.com/expressjs/express.git to /tmp/boby_cloned_repos/expressjs_express...
✅ Successfully cloned expressjs/express
🔍 Analyzing cloned repository: /tmp/boby_cloned_repos/expressjs_express
```

### Frontend (console navigateur)
```
📡 [cloneAndAnalyze] Fetching: http://localhost:8000/clone-and-analyze
📦 [cloneAndAnalyze] Body: {github_url: "https://github.com/expressjs/express", force_reclone: false}
✅ [cloneAndAnalyze] Response status: 200
📥 [cloneAndAnalyze] Response data: {...}
```

## 🎯 Scénarios de test avancés

### Test 1 : Clone multiple
1. Cloner `https://github.com/expressjs/express`
2. Cloner `https://github.com/axios/axios`
3. Cloner `https://github.com/lodash/lodash`
4. Vérifier que tous sont accessibles

### Test 2 : Re-clone
1. Cloner un repo
2. Fermer le widget
3. Rouvrir et re-cloner le même repo
4. Devrait être instantané (déjà cloné)

### Test 3 : Force re-clone
1. Modifier l'API pour passer `force_reclone: true`
2. Le repo devrait être re-cloné même s'il existe

### Test 4 : Nettoyage automatique
1. Cloner 11 repos différents
2. Le premier devrait être supprimé automatiquement
3. Vérifier `/tmp/boby_cloned_repos/` (max 10 repos)

## 📝 Notes de débogage

### Vérifier les repos clonés
```bash
# Lister les repos clonés
ls -la /tmp/boby_cloned_repos/

# Voir la taille
du -sh /tmp/boby_cloned_repos/*

# Nettoyer manuellement si besoin
rm -rf /tmp/boby_cloned_repos/*
```

### Tester le module github_cloner directement
```python
# Dans un terminal Python
cd boby/backend
python

>>> from github_cloner import github_cloner
>>> result = github_cloner.clone_repository("https://github.com/expressjs/express")
>>> print(result)
```

## ✨ Résultat attendu

Après un test réussi, vous devriez pouvoir :

1. ✅ Entrer n'importe quelle URL GitHub publique
2. ✅ Voir le clone en cours (spinner)
3. ✅ Obtenir l'analyse complète du repo
4. ✅ Utiliser tous les modules Boby :
   - Architecture Diagram
   - Smart Checklist
   - Impact Analyzer
   - History Tracker
   - Push Guardian
   - Merge Intelligence

## 🎉 Succès !

Si tous les tests passent, la fonctionnalité est prête pour :
- ✅ Démo au hackathon
- ✅ Déploiement sur Railway/Vercel
- ✅ Utilisation en production

---

**Bon test ! 🚀**