import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { CouponController } from "./coupon.controller";
import { CouponValidations } from "./coupon.validation";

const router = Router();

router.get(
  "/check",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor, USER_ROLE_ENUM.user),
  CouponController.getCouponByCodeAndShop
);

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  CouponController.getCouponById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  CouponController.getAllCoupons
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  validateRequest(CouponValidations.createCouponValidationSchema),
  CouponController.createCoupon
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  validateRequest(CouponValidations.updateCouponValidationSchema),
  CouponController.updateCoupon
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  CouponController.deleteCoupon
);

export const CouponRoutes = router;
