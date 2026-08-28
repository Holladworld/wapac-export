export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email.trim()) return { valid: false, message: 'Email is required' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; message?: string } {
  if (!phone.trim()) return { valid: true };
  const phoneRegex = /^[+]?[\d\s()-]{7,}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, message: 'Phone should contain only numbers, spaces, +, (, ), or -' };
  }
  return { valid: true };
}

export function validateRequired(value: string, fieldName: string): { valid: boolean; message?: string } {
  if (!value.trim()) return { valid: false, message: `${fieldName} is required` };
  return { valid: true };
}

export function validateNumeric(value: string, fieldName: string): { valid: boolean; message?: string } {
  if (!value.trim()) return { valid: false, message: `${fieldName} is required` };
  if (!/^\d+(\.\d+)?$/.test(value.trim())) {
    return { valid: false, message: `${fieldName} must be a number` };
  }
  return { valid: true };
}

export function validateMinLength(value: string, minLen: number, fieldName: string): { valid: boolean; message?: string } {
  if (value.trim().length < minLen) {
    return { valid: false, message: `${fieldName} must be at least ${minLen} characters` };
  }
  return { valid: true };
}

export function sanitizeText(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}
