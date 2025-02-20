declare module "#auth-utils" {
  interface User {
    id: number;
    hash?: string;
    name: string;
    email: string;
    country: string | null;
    birthDate: number | null;
    showAvatar: boolean;
    confirmed: boolean;
    language: MappedLoveLocales;
    createdAt: number;
    updatedAt: number;
    auth?: boolean;
    bond?: Omit<MappedLoveBond, "partners"> | null;
  }
  interface UserSession {
    user?: User;
    maxAge?: number;
  }
}

export {};
