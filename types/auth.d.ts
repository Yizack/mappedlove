declare module "#auth-utils" {
  interface User {
    id: number;
    hash?: string;
    name: string;
    email: string;
    country: string | null;
    birthDate: number | null;
    showAvatar: number;
    confirmed: number;
    createdAt: number;
    updatedAt: number;
    auth?: number;
    bond?: MappedLoveBond;
  }
  interface UserSession {
    user?: MappedLoveUser;
    maxAge?: number;
  }
}

export {};
