import type { ErrorCode } from "~/types/enums/errors";
import type { Quota } from "~/types/enums/quotas";

export {};

declare global {
  type ErrorCode = typeof ErrorCode;
  type Quota = typeof Quota;
}
