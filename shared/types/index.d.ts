import type { ErrorCode } from "#shared/utils/errors";
import type { Quota } from "#shared/utils/quotas";

declare global {
  interface User extends MappedLoveUser {
    hash?: string;
    passwordless?: boolean;
    bond?: Omit<MappedLoveBond, "partners"> | null;
  }
  type ErrorCode = typeof ErrorCode;
  type Quota = typeof Quota;
}

export {};
