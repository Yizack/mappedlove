declare module "#auth-utils" {
  interface User extends MappedLoveUser {
    hash?: string;
    passwordless?: boolean;
    bond?: Omit<MappedLoveBond, "partners"> | null;
  }
  interface UserSession {
    user?: User;
    maxAge?: number;
  }
}

export {};
