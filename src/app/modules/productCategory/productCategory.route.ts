import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { ProductCategoryController } from "./productCategory.controller";
import { ProductCategoryValidations } from "./productCategory.validation";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin),
  ProductCategoryController.getProductCategoryById
);

router.get("/", ProductCategoryController.getAllProductCategories);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin),
  multerUpload.fields([{ name: "logos" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(
    ProductCategoryValidations.createProductCategoryValidationSchema
  ),
  ProductCategoryController.createProductCategory
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin),
  multerUpload.fields([{ name: "logos" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(
    ProductCategoryValidations.updateProductCategoryValidationSchema
  ),
  ProductCategoryController.updateProductCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE_ENUM.admin),
  ProductCategoryController.deleteProductCategory
);

export const ProductCategoryRoutes = router;
