import type { ErrorCode } from "~~/server/utils/errors";
import type { Quota } from "~/server/utils/quotas";

export {};

declare global {
  type ErrorCode = typeof ErrorCode;
  type Quota = typeof Quota;
}
