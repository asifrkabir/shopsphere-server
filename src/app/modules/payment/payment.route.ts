import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.get(
  "/total-revenue",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  PaymentController.getTotalRevenue
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  PaymentController.getAllPayments
);

router.post(
  "/create-payment-intent",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  PaymentController.createPaymentIntent
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  PaymentController.createPayment
);

export const PaymentRoutes = router;
