declare module "#auth-utils" {
  interface User extends MappedLoveUser {
    placeholder?: boolean;
  }
  interface UserSession extends MappedLoveUserSession {
    placeholder?: boolean;
  }
}

export {};
