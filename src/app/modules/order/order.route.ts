import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { OrderController } from "./order.controller";
import { OrderValidations } from "./order.validation";

const router = Router();

router.get(
  "/total-orders",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  OrderController.getTotalOrders
);

router.get(
  "/weekly-sales",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  OrderController.getWeeklySales
);

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  OrderController.getOrderById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  OrderController.getAllOrders
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderController.createOrder
);

export const OrderRoutes = router;
