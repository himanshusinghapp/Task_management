// generateOtp generates a 6-digit numeric OTP as a string.
// Calculation:
// - Math.random() generates a float in [0, 1).
// - Math.random() * 900000 gives a float in [0, 900000).
// - Adding 100000 shifts the range to [100000, 1000000).
// - Math.floor(...) truncates to an integer in [100000, 999999].
// - .toString() converts the number to a string.
// This ensures the OTP is always a 6-digit number (100000 to 999999).
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
