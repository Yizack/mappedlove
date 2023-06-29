import type { H3Event } from "h3";
import type { TurnstileValidationResponse } from "~/node_modules/@nuxtjs/turnstile/dist/runtime/types";

// @ts-expect-error nitro aliases aren't registered
import { useRuntimeConfig } from "#internal/nitro";

const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const verifyTurnstile = async (token: string, event: H3Event): Promise<TurnstileValidationResponse> => {
  const secretKey = useRuntimeConfig(event).turnstile.secretKey;
  return await $fetch(endpoint, {
    method: "POST",
    body: {
      secret: secretKey,
      response: token
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
};
