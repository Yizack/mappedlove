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
    createdAt: number;
    updatedAt: number;
    auth?: boolean;
    bond?: Omit<MappedLoveBond, "partners"> | null;
  }
  interface UserSession {
    user?: MappedLoveUser;
    maxAge?: number;
  }
}

export {};
