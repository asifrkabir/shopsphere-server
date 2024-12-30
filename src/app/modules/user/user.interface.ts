import { USER_ROLE_ENUM } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "vendor";
  profilePicture: string;
  isSuspended: boolean;
  isActive: boolean;
};

export type TSuspendUserToggle = {
  isSuspended: boolean;
};

export type TUserRole = keyof typeof USER_ROLE_ENUM;
