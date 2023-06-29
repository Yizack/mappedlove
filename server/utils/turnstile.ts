export const verifyTurnstile = (secret: string, token: string) => {
  return $fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: {
      secret,
      response: token
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
};
