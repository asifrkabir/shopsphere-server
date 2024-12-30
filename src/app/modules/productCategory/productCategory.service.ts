import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { productCategorySearchableFields } from "./productCategory.constant";
import { TProductCategory } from "./productCategory.interface";
import { ProductCategory } from "./productCategory.model";
import { getExistingProductCategoryById } from "./productCategory.utils";
import mongoose from "mongoose";
import { ProductService } from "../product/product.service";

const getProductCategoryById = async (id: string) => {
  const result = await ProductCategory.findOne({ _id: id, isActive: true });

  return result;
};

const getAllProductCategories = async (query: Record<string, unknown>) => {
  const productCategoryQuery = new QueryBuilder(
    ProductCategory.find({ isActive: true }),
    query
  )
    .search(productCategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productCategoryQuery.modelQuery;
  const meta = await productCategoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createProductCategory = async (payload: TProductCategory) => {
  const result = await ProductCategory.create(payload);

  return result;
};

const updateProductCategory = async (
  id: string,
  payload: Partial<TProductCategory>
) => {
  const existingProductCategory = await getExistingProductCategoryById(id);

  if (!existingProductCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Product Category not found");
  }

  const result = await ProductCategory.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteProductCategory = async (id: string) => {
  const existingProductCategory = await getExistingProductCategoryById(id);

  if (!existingProductCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Product Category not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedProductCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, session }
    );

    if (!deletedProductCategory) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete product category"
      );
    }

    const deleteProductsResult = await ProductService.deleteProductsByFilter(
      id,
      undefined,
      session
    );

    if (deleteProductsResult === null || deleteProductsResult === undefined) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete associated products"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedProductCategory;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw error;
  }
};

export const ProductCategoryService = {
  getProductCategoryById,
  getAllProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
