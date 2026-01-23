// Brand Colors
export const COLORS = {
  primary: '#E53935',      // Red from logo
  primaryDark: '#C62828',
  primaryLight: '#FF6F60',
  secondary: '#757575',    // Metallic gray
  secondaryDark: '#494949',
  secondaryLight: '#A4A4A4',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#757575',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  border: '#333333',
};

// Status Labels in Italian
export const STATUS_LABELS: Record<string, string> = {
  waiting: 'In attesa',
  checked_in: 'Check-in effettuato',
  in_progress: 'In lavorazione',
  testing: 'In collaudo',
  ready: 'Pronto al ritiro',
  delivered: 'Consegnato',
  pending: 'In attesa',
  confirmed: 'Confermato',
  rejected: 'Rifiutato',
  completed: 'Completato',
  cancelled: 'Annullato',
};

// Status Colors
export const STATUS_COLORS: Record<string, string> = {
  waiting: '#FF9800',
  checked_in: '#2196F3',
  in_progress: '#9C27B0',
  testing: '#00BCD4',
  ready: '#4CAF50',
  delivered: '#8BC34A',
  pending: '#FF9800',
  confirmed: '#4CAF50',
  rejected: '#F44336',
  completed: '#8BC34A',
  cancelled: '#9E9E9E',
};

// Category Icons (Expo Vector Icons names)
export const CATEGORY_ICONS: Record<string, string> = {
  tagliando: 'car-service',
  gomme: 'tire',
  diagnosi: 'laptop',
  riparazione: 'tools',
  tuning: 'speedometer',
};

// Service Category Labels
export const CATEGORY_LABELS: Record<string, string> = {
  tagliando: 'Tagliando',
  gomme: 'Gomme',
  diagnosi: 'Diagnosi',
  riparazione: 'Riparazione',
  tuning: 'Tuning',
};
