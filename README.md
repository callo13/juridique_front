# Assistant Juridique IA (Frontend)

Ce projet est l'interface frontend d'une application conçue pour les avocats et juristes. Elle permet de gérer des documents juridiques et de les interroger en langage naturel via un chatbot intelligent.

## 🎯 Objectif du Projet

L'objectif est de faire gagner du temps aux professionnels du droit en simplifiant l'accès à l'information contenue dans de multiples documents complexes. L'utilisateur peut déposer ses fichiers, et le système se charge de les analyser pour permettre une recherche sémantique rapide et pertinente, sans avoir à ouvrir ou lire manuellement chaque document.

## ✨ Fonctionnalités Clés

- **Gestion de Documents par Dossiers** :
  - Créez des dossiers pour organiser vos documents par affaire, client ou thématique.
  - Supprimez des dossiers entiers ou des documents individuels.
  - Interface en arborescence claire et intuitive.

- **Upload de Documents** :
  - Ajoutez des documents (.pdf, .docx, .txt) directement dans le dossier de votre choix.
  - Suivi du statut de l'upload en temps réel (envoi, succès, erreur).

- **Chatbot Intelligent** :
  - Posez des questions en langage naturel à vos documents.
  - Le chatbot effectue une recherche sémantique pour extraire les informations les plus pertinentes.
  - Filtrez la recherche pour interroger l'ensemble de vos documents ou un dossier spécifique.

- **Design Professionnel** :
  - Interface sobre et élégante utilisant une palette de couleurs (Bleu marine & Ivoire) adaptée au domaine juridique.
  - Entièrement responsive et facile à utiliser.

## 🛠️ Stack Technique

- **Framework** : [React](https://reactjs.org/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)

## 🚀 Installation et Lancement

1.  **Clônez le repository :**
    ```sh
    git clone https://github.com/votre-utilisateur/votre-repo.git
    cd votre-repo
    ```

2.  **Installez les dépendances :**
    ```sh
    npm install
    ```

3.  **Lancez le serveur de développement :**
    ```sh
    npm run dev
    ```
    L'application sera accessible à l'adresse `http://localhost:5173` (ou un autre port si celui-ci est occupé).

## 🔌 Endpoints Backend

Ce frontend communique avec un backend qui doit exposer les endpoints suivants :

- `POST /vectorize` : Pour l'upload d'un fichier. Le corps de la requête doit être un `FormData` avec le `file` et l'ID du `folder`.
- `POST /ask` : Pour interroger le chatbot. Le corps de la requête est un JSON contenant la `question` et un `folder_id` (optionnel).

---
*Ce README a été généré pour le frontend de l'application.*
