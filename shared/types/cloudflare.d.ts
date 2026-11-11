import type { CfProperties, ExecutionContext, ExecutionContext, ImagesBinding, Request } from "@cloudflare/workers-types";

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        IMAGES: ImagesBinding;
      };
      context: ExecutionContext;
    };
  }
}

declare module "nuxt/server" {
  interface RequestEventContext {
    cloudflare: {
      request: Request;
      env: {
        IMAGES: ImagesBinding;
      };
      context: ExecutionContext;
    };
  }
}

export {};
