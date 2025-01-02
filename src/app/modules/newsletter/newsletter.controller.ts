import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NewsletterService } from "./newsletter.service";

const getNewsletterSubscriptionById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await NewsletterService.getNewsletterSubscriptionById(id);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Newsletter subscription retrieved successfully",
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

const getAllNewsletterSubscriptions = catchAsync(async (req, res) => {
  const result = await NewsletterService.getAllNewsletterSubscriptions(
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
      message: "Newsletter subscriptions retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createNewsletterSubscription = catchAsync(async (req, res) => {
  const result = await NewsletterService.createNewsletterSubscription(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Newsletter subscription created successfully",
    data: result,
  });
});

const deleteNewsletterSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await NewsletterService.deleteNewsletterSubscription(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Newsletter subscription deleted successfully",
    data: result,
  });
});

export const NewsletterController = {
  getNewsletterSubscriptionById,
  getAllNewsletterSubscriptions,
  createNewsletterSubscription,
  deleteNewsletterSubscription,
};
