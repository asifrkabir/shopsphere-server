import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductCategoryService } from "./productCategory.service";

const getProductCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductCategoryService.getProductCategoryById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Category retrieved successfully",
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

const getAllProductCategories = catchAsync(async (req, res) => {
  const result = await ProductCategoryService.getAllProductCategories(
    req.query
  );

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
      message: "Product Categories retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createProductCategory = catchAsync(async (req, res) => {
  const result = await ProductCategoryService.createProductCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product Category created successfully",
    data: result,
  });
});

const updateProductCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductCategoryService.updateProductCategory(
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Category updated successfully",
    data: result,
  });
});

const deleteProductCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductCategoryService.deleteProductCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Category deleted successfully",
    data: result,
  });
});

export const ProductCategoryController = {
  getProductCategoryById,
  getAllProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
