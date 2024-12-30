export const PRODUCT_STATUS_LIST = ["available", "suspended"];

export const PRODUCT_STATUS_ENUM = {
  AVAILABLE: "available",
  SUSPENDED: "suspended",
} as const;

export type TProductStatus =
  (typeof PRODUCT_STATUS_ENUM)[keyof typeof PRODUCT_STATUS_ENUM];

export const productSearchableFields = ["name", "description"];
