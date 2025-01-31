export const isValidName = (name: string) => {
  return name.length > 0 && name.length <= 50;
};

export const getPasswordRequirements = (password: string) => {
  return {
    hasLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?'":{}|<>]/.test(password)
  };
};

export const isValidPassword = (password: string, requirements?: ReturnType<typeof getPasswordRequirements>) => {
  const validations = requirements || getPasswordRequirements(password);
  return Object.values(validations).every(Boolean);
};

export const isValidPasswordCheck = (password: string, passwordCheck: string) => {
  return password === passwordCheck;
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
