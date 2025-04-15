import type { CfProperties, ExecutionContext, ImagesBinding } from "@cloudflare/workers-types";

export {};

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
