import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { NewsletterController } from "./newsletter.controller";
import { NewsletterValidations } from "./newsletter.validation";

const router = Router();

router.get(
  "/subscriptions/:id",
  auth(USER_ROLE_ENUM.admin),
  NewsletterController.getNewsletterSubscriptionById
);

router.get(
  "/subscriptions",
  auth(USER_ROLE_ENUM.admin),
  NewsletterController.getAllNewsletterSubscriptions
);

router.post(
  "/subscriptions",
  validateRequest(
    NewsletterValidations.createNewsletterSubscriberValidationSchema
  ),
  NewsletterController.createNewsletterSubscription
);

router.delete(
  "/subscriptions/:id",
  NewsletterController.deleteNewsletterSubscription
);

export const NewsletterRoutes = router;
