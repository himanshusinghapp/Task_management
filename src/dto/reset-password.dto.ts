// Reset Password DTO (no Joi)
export interface ResetPasswordDto {
  userId: string;
  otp: string;
  newPassword: string;
}
