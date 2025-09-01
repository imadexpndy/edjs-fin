# EDJS - Plateforme Culturelle

## EDJS Platform

Complete platform combining the EDJS website with the React web application for user management and authentication.

## Description
EDJS est une plateforme culturelle qui connecte les spectacles théâtraux et culturels avec les écoles, associations et familles au Maroc. Notre mission est de rendre la culture accessible à tous.

## Project Structure

- **Root Level**: EDJS website (HTML/CSS/JS) - Main public website
- **React App**: User dashboard and authentication system
- **Supabase**: Backend authentication and database

## Development

### Run Both Applications

```bash
# Install dependencies
npm install

# Run both website and React app
npm run dev:both
```

This will start:
- EDJS website on `http://localhost:8000`
- React app on `http://localhost:5173`

### Run Individually

```bash
# Website only
npm run dev:website

# React app only  
npm run dev
```

## Features

### EDJS Website
- Complete theater platform for schools and families
- Spectacle listings and details
- Contact and registration forms
- Authentication integration with Supabase

### React Web App
- User registration and profile management
- Email confirmation system
- Admin dashboard
- Role-based access control
- Organization management

## Authentication Flow

1. Users visit main website (`index.html`)
2. Registration redirects to React app (`/auth?mode=register`)
3. After registration, email confirmation modal appears
4. Users can access dashboards based on their role

## Spectacles Disponibles
- Casse-Noisette (Âge 4-12)
- Conte Musical (Âge 3-8)
- Théâtre Jeunesse (Âge 8-15)
- Spectacle Familial (Tout âge)

## Technologies Utilisées
- HTML5
- CSS3 (Bootstrap)
- JavaScript (GSAP, Swiper.js, AOS)
- Responsive Design

## Installation et Lancement
1. Clonez le repository
2. Ouvrez le dossier du projet
3. Lancez un serveur local:
   ```bash
   python3 -m http.server 8000
   ```
4. Ouvrez votre navigateur à `http://localhost:8000`

## Structure du Projet
- `index.html` - Page d'accueil
- `about.html` - À propos
- `schools.html` - Page pour les écoles
- `families.html` - Page pour les familles
- `associations.html` - Page pour les associations
- `partners.html` - Page pour les partenaires
- `assets/` - Ressources (CSS, JS, images)

## Contact
- Email: info@edjs.ma
- Téléphone: +212 5 22 98 10 85

## Licence
© 2025 EDJS. Tous droits réservés.
