import { ProductCategory } from "./productCategory.model";

export const getExistingProductCategoryById = async (id: string) => {
  const result = await ProductCategory.findOne({ _id: id, isActive: true });

  return result;
};
