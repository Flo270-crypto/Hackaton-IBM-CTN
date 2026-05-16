# 🤖 Boby - AI-Powered Developer Assistant

> Votre assistant intelligent de développement propulsé par IBM Watsonx AI

Boby est un assistant de développement qui analyse votre code en temps réel, fournit des insights intelligents et vous aide à prendre de meilleures décisions grâce à l'intelligence artificielle d'IBM Watsonx.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![IBM Watsonx](https://img.shields.io/badge/IBM-Watsonx-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)

## ✨ Fonctionnalités

- 🏗️ **Architecture Diagram** - Visualisation interactive de l'architecture de votre projet
- ✅ **Smart Checklist** - Liste de vérification intelligente générée par IA
- 🎯 **Impact Analyzer** - Analyse l'impact de vos modifications sur le codebase
- 📊 **History Tracker** - Suivi de l'historique Git avec insights IA
- 🛡️ **Push Guardian** - Protection avant push avec analyse de risques
- 🔀 **Merge Intelligence** - Assistance intelligente pour les merges

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- Python 3.12+
- Compte IBM Cloud avec accès à Watsonx.ai

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd boby
```

2. **Configuration Backend**
```bash
cd backend
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

3. **Configuration des credentials**

Créez un fichier `.env` dans `backend/` :
```env
WATSONX_API_KEY=votre_clé_api_ibm
WATSONX_PROJECT_ID=votre_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

4. **Configuration Frontend**
```bash
cd ../frontend
npm install
```

Créez un fichier `.env` dans `frontend/` :
```env
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/chemin/vers/votre/projet
```

5. **Lancement**
```bash
# Terminal 1 - Backend
cd backend
./start.sh

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Accédez à http://localhost:5173

## 📚 Documentation complète

Toute la documentation est disponible dans le dossier [`DOCUMENTATION/`](./DOCUMENTATION/):

- **[Guide de configuration](./DOCUMENTATION/SETUP_GUIDE.md)** - Installation et configuration détaillée
- **[Architecture](./DOCUMENTATION/ARCHITECTURE.md)** - Architecture technique du système
- **[Guide d'implémentation](./DOCUMENTATION/IMPLEMENTATION_GUIDE.md)** - Guide de développement
- **[Spécifications Frontend](./DOCUMENTATION/FRONTEND_SPEC.md)** - Détails du frontend React
- **[Intégration API](./DOCUMENTATION/API_INTEGRATION_SUMMARY.md)** - Documentation API
- **[Démarrage rapide](./DOCUMENTATION/QUICKSTART.md)** - Guide de démarrage rapide
- **[Améliorations](./DOCUMENTATION/HACKATHON_IMPROVEMENTS.md)** - Optimisations et améliorations

## 🛠️ Stack technique

### Frontend
- React 18 + Vite
- TailwindCSS
- Lucide React (icônes)
- ReactFlow (diagrammes)

### Backend
- FastAPI (Python)
- IBM Watsonx AI
- GitPython
- Uvicorn

### IA
- IBM Watsonx.ai
- Llama 3.3 70B Instruct

## 📖 Utilisation

1. **Ouvrir le widget** - Cliquez sur l'icône Boby en bas à droite
2. **Choisir un module** - Sélectionnez la fonctionnalité souhaitée
3. **Interagir** - Laissez l'IA analyser et vous guider

## 🔧 Configuration

### Obtenir les credentials IBM Watsonx

1. **API Key** : https://cloud.ibm.com/iam/apikeys
2. **Project ID** : Dans votre projet Watsonx.ai → Manage → Project ID

## 🧪 Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
. venv/bin/activate
pytest
```

## 📊 Structure du projet

```
boby/
├── backend/              # API FastAPI + IBM Watsonx
│   ├── main.py          # Point d'entrée
│   ├── bob_client.py    # Client Watsonx
│   ├── analyzer.py      # Analyse de code
│   └── ...
├── frontend/            # Application React
│   ├── src/
│   │   ├── widget/     # Composants
│   │   └── services/   # API
│   └── ...
├── DOCUMENTATION/       # Documentation complète
└── demo-repo/          # Dépôt de démonstration
```

## 🐛 Dépannage

Consultez le [Guide de configuration](./DOCUMENTATION/SETUP_GUIDE.md#troubleshooting) pour les problèmes courants.

## 🤝 Contribution

Développé dans le cadre d'un hackathon IBM. Les contributions sont les bienvenues !

## 📝 Licence

Ce projet utilise IBM Watsonx AI soumis aux conditions d'IBM Cloud.

## 🙏 Remerciements

- IBM Watsonx.ai pour la plateforme d'IA
- Meta pour le modèle Llama 3.3 70B

---

**Développé avec** ❤️ **et IBM Watsonx AI**