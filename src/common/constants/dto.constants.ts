// DTO Validation Constants
export const DTO_CONSTANTS = {
  // String length limits
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 500,

  // Status values
  STATUS: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  // Priority values
  PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },

  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  }
  
}; 