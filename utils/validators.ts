export const isNameValid = (name: string) => {
  return name.length > 0 && name.length <= 50;
};

export const isPasswordValid = (password: string) => {
  return password.length >= 8;
};

export const isPasswordCheckValid = (password: string, passwordCheck: string) => {
  return isPasswordValid(password) && password === passwordCheck;
};

export const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
