import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import validateRequest from "../../middlewares/validateRequest";
import { ShopValidations } from "./shop.validation";
import { ShopController } from "./shop.controller";

const router = Router();

router.get(
  "/by-owner",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  ShopController.getShopByOwnerId
);

router.get(
  "/:id",
  ShopController.getShopById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  ShopController.getAllShops
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  multerUpload.fields([{ name: "logoUrls" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(ShopValidations.createShopValidationSchema),
  ShopController.createShop
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  multerUpload.fields([{ name: "logoUrls" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(ShopValidations.updateShopValidationSchema),
  ShopController.updateShop
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  ShopController.deleteShop
);

router.patch(
  "/blacklist/:id",
  auth(USER_ROLE_ENUM.admin),
  ShopController.toggleShopBlacklistStatus
);

export const ShopRoutes = router;
