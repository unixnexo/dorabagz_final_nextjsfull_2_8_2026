// Standard, sensible defaults (you asked me to just pick these).

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 2;

export const MAX_FAILED_OTP_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

// Session (login) JWT
export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_EXPIRY_DAYS = 30;

// Impersonation JWT — short-lived on purpose.
export const IMPERSONATION_COOKIE_NAME = "impersonation_token";
export const IMPERSONATION_EXPIRY_HOURS = 1;
