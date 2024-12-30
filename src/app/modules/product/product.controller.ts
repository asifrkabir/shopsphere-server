import httpStatus from "http-status";
import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";

const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductService.getProductById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product retrieved successfully",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: result,
    });
  }
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Products retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductService.createProduct(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await ProductService.updateProduct(
    id,
    userId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductService.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

const getAllProductsForFeed = catchAsync(async (req, res) => {
  let userId = null;

  if (req.user) {
    userId = req.user.userId;
  }

  const result = await ProductService.getAllProductsForFeed(req.query, userId);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Products for feed retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

export const ProductController = {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsForFeed,
};
