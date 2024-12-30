import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { FollowController } from "./follow.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  FollowController.getAllFollows
);

router.post(
  "/:shopId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  FollowController.follow
);

router.delete(
  "/:shopId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  FollowController.unfollow
);

router.get(
  "/check/:shopId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user, USER_ROLE_ENUM.vendor),
  FollowController.checkIfUserFollowsShop
);

export const FollowRoutes = router;
