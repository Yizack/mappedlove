declare global {
  interface User extends MappedLoveUser {
    hash?: string;
    passwordless?: boolean;
    bond?: Omit<MappedLoveBond, "partners"> | null;
  }
}

export {};
