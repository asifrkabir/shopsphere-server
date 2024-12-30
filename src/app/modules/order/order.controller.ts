import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";

const getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderService.getOrderById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order retrieved successfully",
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

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrders(req.query);

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
      message: "Orders retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createOrder = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await OrderService.createOrder(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getTotalOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getTotalOrders(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      data: result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Total orders retrieved successfully",
      data: result,
    });
  }
});

const getWeeklySales = catchAsync(async (req, res) => {
  const result = await OrderService.getWeeklySales(req.query);

  if (result.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      data: result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Weekly sales retrieved successfully",
      data: result,
    });
  }
});

export const OrderController = {
  getOrderById,
  getAllOrders,
  createOrder,
  getTotalOrders,
  getWeeklySales,
};
