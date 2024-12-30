import { Shop } from "./shop.model";

export const getExistingShopById = async (id: string) => {
  const result = await Shop.findOne({ _id: id, isActive: true });

  return result;
};
