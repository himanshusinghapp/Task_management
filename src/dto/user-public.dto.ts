// User Public DTOs (no Joi)
export interface RequestEmailVerificationDto {
  email: string;
}

export interface VerifyEmailOtpDto {
  email: string;
  otp: string;
}

export interface CompleteSignupDto {
  name: string;
  email: string;
  password: string;
} 