
export const errorMessages = {
  ERR_REG_CREATION_FAILED: "Registration failed. Please try again.",
  ERR_REG_USER_EXISTS: "A user with this email already exists.",
  ERR_REG_PASSWORD_MISMATCH: "Passwords do not match.",
  ERR_REG_USERNAME_EXISTS: "This username is already taken.",
  ERR_REG_PASSWORD_WEAK: "Password does not meet security requirements.",
  
  ERR_LOGIN_CRED_WRONG: "Invalid email or password.",
  ERR_LOGIN_NOT_VERIFIED: "Please verify your email address before logging in.",
  ERR_LOGIN_2FA_REQUIRED: "Two-factor authentication code is required.",
  ERR_LOGIN_2FA_INVALID: "Invalid two-factor authentication code.",
  ERR_LOGIN_USER_BANNED: "This account has been banned.",
  ERR_LOGIN_RATE_LIMITED: "Too many login attempts. Please try again later.",

  ERR_VERIFY_TOKEN_INVALID: "Invalid verification token.",
  ERR_VERIFY_TOKEN_EXPIRED: "Verification token expired.",
  ERR_VERIFY_ALREADY_VERIFIED: "Email is already verified.",
  
  ERR_FORGOT_NO_USER: "No user with this email exists.",
  ERR_RESET_TOKEN_INVALID: "Invalid reset token.",
  ERR_RESET_TOKEN_EXPIRED: "Reset token expired.",
  
  ERR_2FA_SETUP_FAILED: "Failed to set up two-factor authentication.",
  ERR_2FA_ALREADY_ENABLED: "Two-factor authentication is already enabled.",
  ERR_2FA_SETUP_PASSWORD_WRONG: "Incorrect password. Cannot set up 2FA.",
  
  ERR_EMAIL_RESEND_FAILED: "Failed to resend verification email.",
  ERR_RESEND_TOO_FREQUENT: "Please wait before requesting another verification email.",
  
  ERR_PROFILE_NOT_FOUND: "User profile not found.",
  ERR_PROFILE_UPDATE_FAILED: "Failed to update profile.",
  ERR_PROFILE_IMAGE_UPDATE_FAILED: "Failed to update profile image.",
  
  ERR_AUTH_TOKEN_INVALID: "Invalid authentication token.",
  ERR_AUTH_TOKEN_EXPIRED: "Authentication token expired.",
  ERR_AUTH_TOKEN_MISSING: "Authentication token missing.",
  ERR_AUTH_INVALID_SESSION: "Invalid session.",
  
  ERR_UNKNOWN: "An unexpected error occurred. Please try again."
};
