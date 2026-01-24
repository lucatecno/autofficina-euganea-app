// Brand Colors - AUTOFFICINA EUGANEA
// Based on official logo: Red text outline, metallic wrench, white text
export const COLORS = {
  // Primary: Deep Red from logo text outline
  primary: '#C10000',
  primaryDark: '#8B0000',
  primaryLight: '#E53935',
  
  // Secondary: Metallic Gray from wrench
  secondary: '#A9A9A9',
  secondaryDark: '#5C5C5C',
  secondaryLight: '#D3D3D3',
  
  // Backgrounds - Dark theme for professional look
  background: '#1A1A1A',
  surface: '#252525',
  surfaceLight: '#333333',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#757575',
  
  // Semantic Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Base
  white: '#FFFFFF',
  black: '#000000',
  border: '#404040',
  
  // Metallic gradient colors (for special effects)
  metallic: {
    light: '#D3D3D3',
    mid: '#A9A9A9',
    dark: '#5C5C5C',
  },
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
