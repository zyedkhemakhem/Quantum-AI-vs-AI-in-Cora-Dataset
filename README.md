# 💡 Quantum AI VS AI

> Application web de simulation et gestion de modèles d'intelligence artificielle, développée dans le cadre du Projet de Fin d'Études (PCD) à l'ENSI.

---

## 🎯 Objectif

Permettre à différents types d'utilisateurs (admin, développeur, utilisateur normal) de :
- Gérer les comptes (admin)
- Développer et intégrer des modèles IA (developer)
- Choisir et évaluer les performances des modèles via des KPIs visuels (user)

---

## 🛠️ Technologies utilisées

### Backend
- Django & Django REST Framework
- JWT (Json Web Token)
- Pipenv pour la gestion d'environnement
- SQLite 

### Frontend
- React.js
- React Router DOM
- Axios
- CSS modules

---

## 👥 Rôles

| Rôle                   | Fonctionnalités principales                                                     |
|-----------------------|--------------------------------------------------------------------------------|
| **Admin**           | Gérer les utilisateurs (CRUD)                                                |
| **Développeur** | Ajouter des modèles, datasets, surveiller les performances |
| **Utilisateur**      | Sélectionner un modèle, visualiser ses KPIs                        |

---

## 🔐 Authentification

L'authentification est basée sur JWT. Le token est stocké côté frontend (`localStorage`) après la connexion.

---

## 🚀 Installation & Démarrage

### 🧩 Partie Backend

```bash
cd backend

# Installer pipenv si non installé
pip install pipenv

# Installer les dépendances du projet
pip install -r requirements.txt
pipenv install djangorestframework
pip install djangorestframework djangorestframework-simplejwt

# Activer l'environnement virtuel
pipenv shell

# Migrations Django
python manage.py makemigrations
python manage.py migrate

# Lancer le serveur backend
python manage.py runserver


### 🧩Partie Frontend (dans un autre terminal)

```bash
cd frontend

# Installer les dépendances React
npm install react react-router-dom axios

# Lancer le serveur frontend
npm run dev


