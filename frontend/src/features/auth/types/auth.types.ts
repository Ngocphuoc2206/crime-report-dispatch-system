export type InternalAuthRole =
  | "OFFICER"
  | "DISPATCHER"
  | "COMMANDER"
  | "ADMIN";

export type LoginFormState = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type InternalAuthUser = {
  id: number;
  username: string;
  fullName: string;
  roles: InternalAuthRole[];
};

export type LoginResult = {
  accessToken: string;
  tokenType: string;
  user: InternalAuthUser;
};
