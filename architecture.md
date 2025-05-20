# Architecture iTravel

## Structure du Monorepo

```
iTravel/
├── apps/
│   ├── backend/                 # API NestJS
│   │   ├── src/
│   │   │   ├── auth/           # Authentification
│   │   │   ├── travel-project/ # Module principal
│   │   │   │   ├── component/  # Composants (transport, lodging, etc.)
│   │   │   │   └── project/    # Gestion des projets
│   │   │   ├── notifications/  # Notifications temps réel
│   │   │   ├── monitoring/     # Monitoring & logging
│   │   │   └── websocket/      # WebSocket Gateway
│   │   ├── prisma/            # Schéma & migrations
│   │   └── test/              # Tests
│   │
│   └── app/                    # App Expo (React Native + Web)
│       ├── src/
│       │   ├── features/       # Organisation par feature
│       │   │   ├── auth/       # Authentification
│       │   │   ├── projects/   # Gestion projets
│       │   │   ├── transport/  # Transport
│       │   │   ├── lodging/    # Hébergement
│       │   │   ├── expenses/   # Dépenses
│       │   │   ├── gallery/    # Galerie photo
│       │   │   └── community/  # Espace communautaire
│       │   ├── components/     # Composants UI réutilisables
│       │   ├── hooks/         # Hooks personnalisés
│       │   ├── stores/        # Stores Zustand
│       │   │   ├── global/    # État global
│       │   │   └── features/  # État par feature
│       │   ├── api/          # Clients API & TanStack Query
│       │   └── utils/        # Utilitaires
│       └── assets/           # Images, fonts, etc.
│
└── packages/
    └── shared/               # Types & DTOs partagés
        ├── src/
        │   ├── types/       # Types TypeScript
        │   ├── dto/         # DTOs
        │   ├── enums/       # Enums
        │   └── constants/   # Constantes
        └── package.json

```

## Rôles des Dossiers Principaux

### Backend (`apps/backend/`)
- `auth/` : Authentification multi-provider (JWT, OAuth)
- `travel-project/` : Logique métier principale
  - `component/` : Modules fonctionnels (transport, lodging)
  - `project/` : Gestion des projets de voyage
- `notifications/` : Système de notifications temps réel
- `monitoring/` : Logging & monitoring
- `websocket/` : Gestion des connexions WebSocket
- `prisma/` : Schéma de base de données & migrations

### Frontend (`apps/app/`)
- `features/` : Organisation par feature
  - Chaque feature contient ses composants, hooks, et stores
- `components/` : Composants UI réutilisables
- `stores/` : Gestion d'état avec Zustand
  - `global/` : État global (auth, thème, etc.)
  - `features/` : État spécifique aux features
- `api/` : Clients API & configuration TanStack Query
- `hooks/` : Hooks personnalisés réutilisables

### Shared (`packages/shared/`)
- Types, DTOs, et enums partagés entre front et back
- Évite la duplication de code
- Assure la cohérence des types

## Étapes de Migration

1. **Préparation**
   ```bash
   # Créer la structure
   mkdir -p apps/backend apps/app packages/shared
   ```

2. **Backend**
   ```bash
   # Déplacer le code existant
   mv src/* apps/backend/src/
   # Mettre à jour les imports
   # Adapter le tsconfig.json
   ```

3. **Shared Package**
   ```bash
   # Initialiser le package
   cd packages/shared
   npm init
   # Copier les types/DTOs
   # Configurer TypeScript
   ```

4. **Frontend**
   ```bash
   # Créer l'app Expo
   npx create-expo-app apps/app
   # Installer les dépendances
   npm install @tamagui/core zustand @tanstack/react-query
   ```

## Organisation Frontend

### Feature-Based Structure
```
features/
├── auth/
│   ├── components/     # Composants spécifiques
│   ├── hooks/         # Hooks d'authentification
│   ├── stores/        # Store Zustand
│   └── types.ts       # Types locaux
├── projects/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   └── types.ts
└── ...
```

### Gestion d'État (Zustand)

#### Store Global
```typescript
// stores/global/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}
```

#### Stores par Feature
```typescript
// features/projects/stores/project.store.ts
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  fetchProjects: () => Promise<void>;
  selectProject: (id: string) => void;
}
```

### Partage des Types

1. **Dans le package shared**
```typescript
// packages/shared/src/types/project.ts
export interface Project {
  id: string;
  name: string;
  // ...
}
```

2. **Utilisation dans le backend**
```typescript
// apps/backend/src/travel-project/project.service.ts
import { Project } from '@itravel/shared';
```

3. **Utilisation dans le frontend**
```typescript
// apps/app/src/features/projects/components/ProjectCard.tsx
import { Project } from '@itravel/shared';
```

## Features Frontend

### Auth Multi-Provider
- JWT + OAuth (Google, Apple)
- Gestion des sessions
- Refresh tokens

### Gestion Projets
- CRUD projets
- Invitations & permissions
- Vue d'ensemble & détails

### Votes & Commentaires
- Système de vote
- Commentaires en temps réel
- Notifications

### Chat & Notifications
- WebSocket pour le temps réel
- Notifications push
- Historique des messages

### Gestion Dépenses
- Suivi des dépenses
- Catégorisation
- Rapports & statistiques

### Galerie Photo
- Upload & gestion
- Partage
- Filtres & recherche

### Espace Communautaire
- Profils utilisateurs
- Partage d'expériences
- Système de suivi 