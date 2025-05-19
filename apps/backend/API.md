# iTravel API Documentation

## Authentification
Toutes les routes nécessitent une authentification via JWT Supabase.

### Headers requis
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Projets de Voyage

#### Créer un projet
```http
POST /travel-project
Content-Type: application/json

{
  "title": "string",
  "description": "string"
}
```

#### Lister les projets
```http
GET /travel-project
```

#### Obtenir un projet
```http
GET /travel-project/:id
```

#### Ajouter un participant
```http
POST /travel-project/:id/participants
Content-Type: application/json

{
  "userId": "string"
}
```

### Logements

#### Créer un logement
```http
POST /projects/:projectId/lodging
Content-Type: application/json

{
  "name": "string",
  "address": "string",
  "price": number,
  "type": "HOTEL" | "HOSTEL" | "APARTMENT" | "HOUSE" | "CAMPING" | "OTHER",
  "link": "string"
}
```

#### Lister les logements
```http
GET /projects/:projectId/lodging
```

#### Voter pour un logement
```http
POST /projects/:projectId/lodging/:id/vote
Content-Type: application/json

{
  "vote": boolean,
  "comment": "string"
}
```

### Transports

#### Créer une option de transport
```http
POST /projects/:projectId/transport
Content-Type: application/json

{
  "type": "FLIGHT" | "TRAIN" | "BUS" | "CARPOOL" | "FERRY" | "OTHER",
  "departure": "string",
  "arrival": "string",
  "date": "string",
  "duration": "string",
  "price": number,
  "link": "string",
  "company": "string"
}
```

#### Lister les transports
```http
GET /projects/:projectId/transport
```

#### Voter pour un transport
```http
POST /projects/:projectId/transport/:id/vote
Content-Type: application/json

{
  "vote": boolean,
  "comment": "string"
}
```

## Codes d'erreur

- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `429` - Trop de requêtes (rate limit)

## Rate Limiting
- 100 requêtes par minute par IP
- Headers de réponse :
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset` 