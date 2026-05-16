# 📚 Boby - Documentation Complète

Bienvenue dans la documentation complète de **Boby**, l'assistant intelligent pour développeurs utilisant IBM Watsonx AI.

## 🎯 Vue d'ensemble

Boby est un assistant de développement qui analyse votre code en temps réel, fournit des insights intelligents et vous aide à prendre de meilleures décisions de développement grâce à l'IA d'IBM Watsonx.

### Fonctionnalités principales

- **Architecture Diagram** - Visualisation interactive de l'architecture de votre projet
- **Smart Checklist** - Liste de vérification intelligente générée par IA
- **Impact Analyzer** - Analyse l'impact de vos modifications sur le codebase
- **History Tracker** - Suivi de l'historique Git avec insights IA
- **Push Guardian** - Protection avant push avec analyse de risques
- **Merge Intelligence** - Assistance intelligente pour les merges

## 📖 Table des matières

### 🚀 Démarrage rapide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guide d'installation et configuration complète
- **[QUICKSTART.md](./QUICKSTART.md)** - Démarrage rapide pour commencer immédiatement

### 🏗️ Architecture & Design
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture technique détaillée du système
- **[FRONTEND_SPEC.md](./FRONTEND_SPEC.md)** - Spécifications complètes du frontend React
- **[API_INTEGRATION_SUMMARY.md](./API_INTEGRATION_SUMMARY.md)** - Documentation de l'intégration API

### 📋 Guides de développement
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guide d'implémentation détaillé
- **[PLAN_SUMMARY.md](./PLAN_SUMMARY.md)** - Résumé du plan de développement
- **[HACKATHON_IMPROVEMENTS.md](./HACKATHON_IMPROVEMENTS.md)** - Améliorations et optimisations

## 🛠️ Stack technique

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool et dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icônes
- **ReactFlow** - Diagrammes interactifs

### Backend
- **FastAPI** - Framework API Python
- **IBM Watsonx AI** - Intelligence artificielle
- **GitPython** - Analyse Git
- **Uvicorn** - Serveur ASGI

### IA & Modèles
- **IBM Watsonx.ai** - Plateforme IA
- **Llama 3.3 70B Instruct** - Modèle de langage

## 🚦 Démarrage rapide

### Prérequis
- Node.js 18+
- Python 3.12+
- Compte IBM Cloud avec accès à Watsonx.ai

### Installation en 3 étapes

1. **Configuration Backend**
```bash
cd boby/backend
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

2. **Configuration des credentials**
Éditez `boby/backend/.env`:
```env
WATSONX_API_KEY=votre_clé_api
WATSONX_PROJECT_ID=votre_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

3. **Lancement**
```bash
# Terminal 1 - Backend
cd boby/backend
./start.sh

# Terminal 2 - Frontend
cd boby/frontend
npm install
npm run dev
```

Accédez à http://localhost:5173

## 📊 Architecture du projet

```
boby/
├── backend/              # API FastAPI + IBM Watsonx
│   ├── main.py          # Point d'entrée API
│   ├── bob_client.py    # Client Watsonx
│   ├── analyzer.py      # Analyse de code
│   ├── git_tracker.py   # Suivi Git
│   └── push_guardian.py # Validation pre-push
├── frontend/            # Application React
│   ├── src/
│   │   ├── widget/     # Composants du widget
│   │   ├── context/    # Context React
│   │   └── services/   # Services API
│   └── public/
├── demo-repo/          # Dépôt de démonstration
└── DOCUMENTATION/      # Documentation complète
```

## 🔧 Configuration

### Variables d'environnement Backend
```env
WATSONX_API_KEY=<votre_clé>
WATSONX_PROJECT_ID=<votre_projet>
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### Variables d'environnement Frontend
```env
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/chemin/vers/votre/projet
```

## 🎨 Utilisation

### 1. Ouvrir le widget
Cliquez sur l'icône Boby en bas à droite de votre écran.

### 2. Choisir un module
- **Architecture** - Visualisez la structure de votre projet
- **Checklist** - Obtenez une checklist de test générée par IA
- **Impact** - Analysez l'impact de vos changements
- **History** - Explorez l'historique Git avec insights
- **Push Guardian** - Vérifiez avant de pusher
- **Merge Intelligence** - Assistance pour les merges

### 3. Interagir avec l'IA
Chaque module utilise IBM Watsonx pour fournir des insights intelligents et contextuels.

## 🔌 API Endpoints

### Analyse de code
```
POST /analyze
Body: { "path": "/chemin/vers/projet" }
```

### Historique Git
```
POST /history
Body: { "path": "/chemin/vers/projet", "limit": 10 }
```

### Push Guardian
```
POST /push-guardian
Body: { "path": "/chemin/vers/projet" }
```

### Impact Analysis
```
POST /impact
Body: { "path": "/chemin/vers/projet" }
```

### Merge Intelligence
```
POST /merge-intelligence
Body: { "path": "/chemin/vers/projet", "source": "branch", "target": "main" }
```

## 🧪 Tests

### Frontend
```bash
cd boby/frontend
npm test              # Tests unitaires
npm run test:ui       # Interface de test
npm run test:coverage # Couverture de code
```

### Backend
```bash
cd boby/backend
. venv/bin/activate
pytest                # Tous les tests
pytest --cov          # Avec couverture
```

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifiez que les credentials IBM Watsonx sont corrects
- Assurez-vous que le virtual environment est activé
- Vérifiez que le port 8000 est libre

### Frontend affiche "Failed to fetch"
- Vérifiez que le backend est démarré sur le port 8000
- Vérifiez le fichier `.env` du frontend
- Consultez la console du navigateur pour plus de détails

### Erreur d'authentification Watsonx
- Vérifiez votre API key sur https://cloud.ibm.com/iam/apikeys
- Vérifiez votre Project ID dans les paramètres du projet Watsonx
- Assurez-vous que l'URL correspond à votre région

## 📈 Performance

- **Temps de réponse API** : < 2s en moyenne
- **Analyse de code** : ~1-3s selon la taille du projet
- **Génération de checklist** : ~2-4s
- **Analyse d'impact** : ~1-2s

## 🔒 Sécurité

- Les credentials IBM Watsonx sont stockés dans `.env` (non versionné)
- Communication HTTPS avec IBM Cloud
- CORS configuré pour localhost uniquement en développement
- Pas de stockage de données sensibles côté client

## 🤝 Contribution

Ce projet a été développé dans le cadre d'un hackathon IBM. Pour contribuer :

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet utilise IBM Watsonx AI qui est soumis aux conditions d'utilisation d'IBM Cloud.

## 🙏 Remerciements

- **IBM Watsonx.ai** pour la plateforme d'IA
- **Meta** pour le modèle Llama 3.3 70B
- **Équipe de développement** pour le hackathon

## 📞 Support

Pour toute question ou problème :
1. Consultez d'abord cette documentation
2. Vérifiez les logs du backend et frontend
3. Consultez la documentation IBM Watsonx : https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-overview.html

---

**Version** : 1.0.0  
**Dernière mise à jour** : Mai 2026  
**Développé avec** : ❤️ et IBM Watsonx AI