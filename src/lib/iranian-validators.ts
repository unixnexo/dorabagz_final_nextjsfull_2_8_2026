/**
 * Validates an Iranian mobile number in the format 09xxxxxxxxx (11 digits).
 */
export function isValidIranianPhoneNumber(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

/**
 * Validates an Iranian national code (کد ملی) using the standard
 * checksum algorithm. 10 digits, last digit is a check digit.
 */
export function isValidIranianNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;

  // Reject obvious fakes like "0000000000" or "1111111111"
  if (/^(\d)\1{9}$/.test(code)) return false;

  const digits = code.split("").map(Number);
  const checkDigit = digits[9];

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  const remainder = sum % 11;

  if (remainder < 2) {
    return checkDigit === remainder;
  }
  return checkDigit === 11 - remainder;
}
