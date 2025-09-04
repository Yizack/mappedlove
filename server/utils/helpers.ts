import { subtle } from "node:crypto";
import { Buffer } from "node:buffer";
import { digest } from "ohash";
import { type ExtractComponentProps, render } from "@vue-email/render";
// @ts-expect-error no types from html-to-text
import { convert } from "html-to-text";
import type { H3Event } from "h3";
import type { Component } from "vue";

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

export const isTokenDateExpired = (timestamp: number) => {
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

export const toBase64URL = (data: ArrayBuffer | string) => {
  if (typeof data === "string") {
    return Buffer.from(data).toString("base64url");
  }
  return Buffer.from(data).toString("base64url");
};

export const fromBase64URL = (data: string) => {
  return Buffer.from(data, "base64url").toString("utf-8");
};

const HMAC_SHA256 = { name: "HMAC", hash: "SHA-256" };
const encoder = new TextEncoder();

export const generateToken = async (event: H3Event, fields: (unknown)[]) => {
  const config = useRuntimeConfig(event);
  const signature = await subtle.importKey("raw", encoder.encode(config.secure.secret), HMAC_SHA256, false, ["sign"]);
  const hmac = await subtle.sign(HMAC_SHA256.name, signature, encoder.encode(fields.join()));
  return toBase64URL(hmac);
};

export const renderEmail = async <T extends Component>(component: T, props?: ExtractComponentProps<T>) => {
  const html = await render(component, props);
  const text = convert(html, {
    selectors: [
      { selector: "img", format: "skip" }
    ]
  });
  return { html, text };
};
