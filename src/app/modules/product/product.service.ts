import httpStatus from "http-status";
import { ClientSession, Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { getExistingProductCategoryById } from "../productCategory/productCategory.utils";
import { getExistingShopById } from "../shop/shop.utils";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { getExistingUserById } from "../user/user.utils";
import {
  PRODUCT_STATUS_ENUM,
  productSearchableFields,
  TProductStatus,
} from "./product.constant";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";
import { getExistingProductById } from "./product.utils";
import { Follow } from "../follow/follow.model";

const getProductById = async (id: string) => {
  const result = await Product.findOne({ _id: id, isActive: true }).populate(
    "shop category"
  );

  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isActive: true }).populate("shop category"),
    query
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createProduct = async (payload: TProduct, images: TImageFiles) => {
  const existingShop = await getExistingShopById(payload.shop.toString());

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const existingProductCategory = await getExistingProductCategoryById(
    payload.category.toString()
  );

  if (!existingProductCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  payload.shop = existingShop._id;
  payload.category = existingProductCategory._id;

  const { productImages } = images;

  if (productImages && productImages.length > 0) {
    payload.imageUrls = productImages.map((image) => image.path);
  }

  const result = await Product.create(payload);

  return result;
};

const updateProduct = async (
  productId: string,
  userId: string,
  payload: Partial<TProduct>,
  images: TImageFiles
) => {
  const existingProduct = await getExistingProductById(productId);

  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingShop = await getExistingShopById(
    existingProduct.shop.toString()
  );

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  if (
    existingUser.role === USER_ROLE_ENUM.vendor &&
    existingShop.owner._id.toString() !== existingUser._id.toString()
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this product"
    );
  }

  let existingImageUrls: string[] = [];
  let newImageUrls: string[] = [];

  if (payload.imageUrls && payload.imageUrls.length > 0) {
    existingImageUrls = payload.imageUrls;
  }

  const { productImages } = images;

  if (productImages && productImages.length > 0) {
    newImageUrls = productImages.map((image) => image.path);
  }

  const finalImageUrls = [...existingImageUrls, ...newImageUrls];
  payload.imageUrls = finalImageUrls;

  const result = await Product.findOneAndUpdate({ _id: productId }, payload, {
    new: true,
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const existingProduct = await getExistingProductById(id);

  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  return result;
};

const deleteProductsByFilter = async (
  categoryId?: string,
  shopId?: string,
  session?: ClientSession
) => {
  const filter: Record<string, string> = {};
  if (categoryId) filter.category = categoryId;
  if (shopId) filter.shop = shopId;

  const result = await Product.updateMany(
    filter,
    { isActive: false },
    {
      session: session,
    }
  );

  if (!result) {
    return null;
  }

  return result.modifiedCount;
};

const toggleAllProductsStatusByShop = async (
  shopId: string,
  status: TProductStatus,
  session?: ClientSession
) => {
  const result = await Product.updateMany(
    { shop: shopId },
    { status },
    { session }
  );

  if (!result) {
    return null;
  }

  return result.modifiedCount;
};

const getAllProductsForFeed = async (
  query: Record<string, unknown>,
  userId?: string
) => {
  let followedShopIds: Types.ObjectId[] = [];

  if (userId) {
    const follows = await Follow.find({ follower: userId }).select("shop");
    followedShopIds = follows.map((follow) => new Types.ObjectId(follow.shop));
  }

  const filterQuery = { ...query };
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  excludeFields.forEach((field) => delete filterQuery[field]);

  const matchConditions: Record<string, unknown> = {
    isActive: true,
    status: PRODUCT_STATUS_ENUM.AVAILABLE,
  };

  if (filterQuery.name) {
    matchConditions.name = filterQuery.name as string;
  }

  if (filterQuery.category) {
    matchConditions.category = new Types.ObjectId(
      filterQuery.category as string
    );
  }

  if (filterQuery.onSale) {
    matchConditions.onSale = (filterQuery.onSale === "true") as boolean;
  }

  if (filterQuery.shop) {
    matchConditions.shop = new Types.ObjectId(filterQuery.shop as string);
  }

  if (filterQuery.priceMin || filterQuery.priceMax) {
    matchConditions.price = matchConditions.price || {};
    if (filterQuery.priceMin) {
      (matchConditions.price as Record<string, number>).$gte = Number(
        filterQuery.priceMin
      );
    }
    if (filterQuery.priceMax) {
      (matchConditions.price as Record<string, number>).$lte = Number(
        filterQuery.priceMax
      );
    }
  }

  let productQuery = Product.aggregate([
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: "shops",
        localField: "shop",
        foreignField: "_id",
        as: "shop",
      },
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        isFollowed: {
          $cond: {
            if: {
              $in: [{ $arrayElemAt: ["$shop._id", 0] }, followedShopIds],
            },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $sort: {
        isFollowed: -1,
        createdAt: -1,
      },
    },
    // {
    //   $project: {
    //     isFollowed: 0,
    //   },
    // },
    {
      $unwind: {
        path: "$shop",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  if (query.searchTerm) {
    productQuery = productQuery.match({
      $or: productSearchableFields.map((field: string) => ({
        [field]: { $regex: query.searchTerm, $options: "i" },
      })),
    });
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  productQuery = productQuery.skip(skip).limit(limit);

  const result = await productQuery;

  const total = await Product.countDocuments({
    isActive: true,
    status: PRODUCT_STATUS_ENUM.AVAILABLE,
    ...matchConditions,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    meta: { total, page, limit, totalPage },
    result,
  };
};

export const ProductService = {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductsByFilter,
  toggleAllProductsStatusByShop,
  getAllProductsForFeed,
};
