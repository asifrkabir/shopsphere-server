import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { FollowRoutes } from "../modules/follow/follow.route";
import { OrderRoutes } from "../modules/order/order.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ProductRoutes } from "../modules/product/product.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { ShopRoutes } from "../modules/shop/shop.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductCategoryRoutes } from "./../modules/productCategory/productCategory.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/shops",
    route: ShopRoutes,
  },
  {
    path: "/product-categories",
    route: ProductCategoryRoutes,
  },
  {
    path: "/follows",
    route: FollowRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
