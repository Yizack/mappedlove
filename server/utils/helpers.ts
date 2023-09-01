import { sha256 } from "ohash";

export const hash = (string: string, salt?: string) => {
  return sha256(salt ? string + salt : string);
};

export const bondCode = (id: number) => {
  return `${String(id).padStart(4, "0")}-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

export const partnerIdFromCode = (code: string) => {
  return Number(code.split("-")[0]);
};

export const SITE = {
  name: "MappedLove",
  host: process.dev ? "http://localhost:5173" : "https://mappedlove.com",
  cdn: process.dev ? "http://localhost:5173" : "https://cdn.mappedlove.com",
};
