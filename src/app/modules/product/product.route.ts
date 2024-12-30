import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { parseBody } from "../../middlewares/bodyParser";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import validateRequest from "../../middlewares/validateRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { ProductController } from "./product.controller";
import { ProductValidations } from "./product.validation";
import optionalAuth from "../../middlewares/optionalAuth";

const router = Router();

router.get("/feed", optionalAuth(), ProductController.getAllProductsForFeed);

router.get(
  "/:id",
  ProductController.getProductById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  ProductController.getAllProducts
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  multerUpload.fields([{ name: "productImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductController.createProduct
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  multerUpload.fields([{ name: "productImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.vendor),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
