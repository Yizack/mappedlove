import { digest } from "ohash";
import type { H3Event } from "h3";

export { z } from "zod";

export const hash = (string: string, salt?: string) => {
  return digest(salt ? string + salt : string);
};

export const createBondCode = (id: number) => {
  return Math.random().toString(36).substring(2, 6).toUpperCase() + id;
};

export const partnerIdFromCode = (code: string) => {
  return Number(code.substring(4));
};

export const isCodeDateExpired = (timestamp: number) => {
  return Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000;
};

export const getGracePeriod = (timestamp: number, days: number) => {
  return timestamp + (days * 24 * 60 * 60 * 1000);
};

export const getPartners = async (event: H3Event, DB: ReturnType<typeof useDB>, bond: Partial<MappedLoveBond>) => {
  const partners = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    showAvatar: tables.users.showAvatar,
    birthDate: tables.users.birthDate,
    country: tables.users.country,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(or(eq(tables.users.id, bond.partner1!), eq(tables.users.id, bond.partner2!))).limit(2).all();

  const { secure } = useRuntimeConfig(event);

  return partners.map(partner => ({
    ...partner,
    hash: hash([partner.id].join(), secure.salt)
  }));
};
