import type { User as AuthUser } from "#auth-utils";
import type { ErrorCode } from "#shared/utils/errors";
import type { Quota } from "#shared/utils/quotas";

export {};

declare global {
  type User = AuthUser;
  type ErrorCode = typeof ErrorCode;
  type Quota = typeof Quota;
}
