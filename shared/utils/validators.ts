export const isValidName = (name: string) => {
  return name.length > 0 && name.length <= 50;
};

export const isValidPassword = (password: string) => {
  return password.length >= 8;
};

export const isValidPasswordCheck = (password: string, passwordCheck: string) => {
  return isValidPassword(password) && password === passwordCheck;
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
