# Architecture iTravel

## Vue d'ensemble
iTravel est une application de planification de voyage collaborative qui permet aux utilisateurs de créer, partager et collaborer sur des projets de voyage.

## Structure du Projet

### Backend (NestJS)
```
apps/backend/src/
├── core/                    # Fonctionnalités centrales
│   ├── auth/               # Authentification et autorisation
│   ├── monitoring/         # Surveillance et métriques
│   ├── notifications/      # Système de notifications
│   ├── upload/            # Gestion des uploads
│   ├── email/             # Service d'emails
│   ├── ai/                # Intégration IA
│   └── utils/             # Utilitaires partagés
├── social/                 # Fonctionnalités sociales
│   ├── stories/           # Histoires de voyage
│   ├── posts/             # Posts et publications
│   ├── chat/              # Système de messagerie
│   └── vote/              # Système de vote
├── travel-project/         # Gestion des projets de voyage
│   ├── component/         # Composants du projet
│   │   ├── transport/     # Gestion des transports
│   │   ├── destination/   # Gestion des destinations
│   │   ├── activity/      # Gestion des activités
│   │   └── date-suggestion/ # Suggestions de dates
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # Entités du domaine
│   ├── interfaces/        # Interfaces TypeScript
│   └── types/             # Types personnalisés
├── users/                  # Gestion des utilisateurs
├── settings/              # Paramètres utilisateur
└── prisma/                # Configuration et migrations Prisma
```

### Frontend (Next.js)
```
apps/frontend/
├── src/
│   ├── app/              # Routes et pages
│   ├── components/       # Composants React
│   ├── hooks/           # Hooks personnalisés
│   ├── lib/             # Utilitaires et configurations
│   └── styles/          # Styles globaux
└── public/              # Assets statiques
```

### Shared
```
packages/shared/
├── src/
│   ├── types/           # Types partagés
│   ├── constants/       # Constantes partagées
│   ├── utils/           # Utilitaires partagés
│   └── ui/              # Composants UI partagés
```

## Stack Technologique

### Backend
- **Framework**: NestJS
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: Supabase Auth
- **Stockage**: Supabase Storage
- **Monitoring**: Prometheus & Grafana
- **Tests**: Jest & Supertest

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Formulaires**: React Hook Form
- **Validation**: Zod
- **Tests**: Vitest & React Testing Library

## Fonctionnalités Principales

### Core
- Authentification et autorisation
- Gestion des utilisateurs
- Système de notifications
- Upload et gestion des médias
- Intégration IA pour suggestions

### Social
- Stories de voyage
- Posts et publications
- Système de messagerie
- Système de vote et notation

### Travel
- Création et gestion de projets
- Planification d'itinéraires
- Gestion des transports
- Suggestions d'activités
- Collaboration en temps réel

### User
- Profils utilisateurs
- Paramètres personnalisés
- Préférences de voyage
- Historique des voyages

## Architecture Technique

### Backend
- Architecture modulaire avec NestJS
- API RESTful
- WebSockets pour le temps réel
- Middleware de monitoring
- Gestion des erreurs centralisée

### Frontend
- Architecture basée sur les composants
- Routing avec App Router
- Gestion d'état optimisée
- Composants UI réutilisables
- Responsive design

### Base de données
- Schéma Prisma optimisé
- Migrations automatiques
- Relations bien définies
- Indexation appropriée

## Bonnes Pratiques
- Tests unitaires et d'intégration
- Documentation du code
- Gestion des erreurs
- Logging structuré
- CI/CD automatisé

## Évolution Future
- Intégration de paiements
- Système de recommandations
- Fonctionnalités offline
- Applications mobiles
- Intégrations tierces

## Points d'Attention
- Sécurité des données
- Performance des requêtes
- Scalabilité
- Maintenance du code
- Expérience utilisateur 