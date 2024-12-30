import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviews(req.query);

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
      message: "Reviews retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createReview = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await ReviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewService.deleteReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

const replyToReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewService.replyToReview(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reply added successfully",
    data: result,
  });
});

export const ReviewController = {
  getAllReviews,
  createReview,
  deleteReview,
  replyToReview,
};
