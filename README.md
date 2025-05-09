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

HomeScreen :
![image](https://github.com/user-attachments/assets/cedefe70-2dab-47d4-84b8-e6725804360d)


Page Connexion :
![image](https://github.com/user-attachments/assets/a6337d95-8272-4866-8727-18c457beb5d5)

Capture Formulaire :
![image](https://github.com/user-attachments/assets/8dc4effa-75a2-4b60-a2e0-cecfec211800)

Interface Utilisatuer:
![image](https://github.com/user-attachments/assets/423bc5bb-c76b-4784-8406-3ab3dff9fc23)

interface Admin:
![image](https://github.com/user-attachments/assets/f7e496b1-b526-47bf-a708-acb78991d361)

Interface Admin : 
![image](https://github.com/user-attachments/assets/dbf9d39d-a48c-4405-ac62-249abeecfacc)

Interface Developper:
![image](https://github.com/user-attachments/assets/69600bbf-7ca8-401b-bd68-edc4d5c09292)



