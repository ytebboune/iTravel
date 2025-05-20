export interface WebSocketUser {
  id: string;
  email: string;
}

export interface WebSocketComment {
  id: string;
  content: string;
  userId: string;
  user: WebSocketUser;
  createdAt: Date;
}

export interface WebSocketVote {
  id: string;
  userId: string;
  user: WebSocketUser;
  votedAt: Date;
  vote: boolean;
  comment?: string;
}

export interface WebSocketSelection {
  id: string;
  isSelected: boolean;
  selectedBy: string;
  selectedAt: Date;
}

export type ComponentType = 'transport' | 'lodging' | 'activity' | 'date' | 'destination';

export interface CommentEvent {
  type: ComponentType;
  projectId: string;
  comment: WebSocketComment;
  [key: string]: any; // Pour les IDs spécifiques (transportId, lodgingId, etc.)
}

export interface VoteEvent {
  type: ComponentType;
  projectId: string;
  vote: WebSocketVote;
  [key: string]: any; // Pour les IDs spécifiques
}

export interface SelectionEvent {
  type: ComponentType;
  projectId: string;
  selection: WebSocketSelection;
  [key: string]: any; // Pour les IDs spécifiques
}

export interface ErrorEvent {
  code: string;
  message: string;
  details?: any;
}

export interface WebSocketEvents {
  // Événements de connexion
  'connect': () => void;
  'disconnect': () => void;
  'error': (error: ErrorEvent) => void;

  // Événements de room
  'joinProject': (projectId: string) => void;
  'leaveProject': (projectId: string) => void;

  // Événements de commentaires
  'commentReceived': (event: CommentEvent) => void;
  'commentDeleted': (event: CommentEvent) => void;

  // Événements de votes
  'voteReceived': (event: VoteEvent) => void;
  'voteDeleted': (event: VoteEvent) => void;

  // Événements de sélection
  'selectionReceived': (event: SelectionEvent) => void;
  'selectionRemoved': (event: SelectionEvent) => void;

  // Événements de notification
  'notificationReceived': (notification: any) => void;
} 