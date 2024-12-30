import { Product } from "./product.model";

export const getExistingProductById = async (id: string) => {
  const result = await Product.findOne({ _id: id, isActive: true });

  return result;
};
