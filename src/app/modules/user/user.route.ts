import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.get(
  "/total-users",
  auth(USER_ROLE_ENUM.admin),
  UserController.getTotalUsers
);

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  UserController.getUserById
);

router.get("/", auth(USER_ROLE_ENUM.admin), UserController.getAllUsers);

router.put(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(UserValidations.updateUserValidationSchema),
  UserController.updateUser
);

router.patch(
  "/:id",
  auth(USER_ROLE_ENUM.admin),
  UserController.toggleUserSuspend
);

router.delete("/:id", auth(USER_ROLE_ENUM.admin), UserController.deleteUser);

export const UserRoutes = router;
