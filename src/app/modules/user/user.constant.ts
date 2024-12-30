export const USER_ROLE_LIST = ["admin", "user", "vendor"];

export const USER_ROLE_ENUM = {
  admin: "admin",
  user: "user",
  vendor: "vendor",
} as const;

export const userSearchableFields = ["name", "email", "role"];
