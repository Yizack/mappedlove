import { sha256 } from "ohash";

export const hash = (password, salt) => {
  return sha256(password + salt);
};
