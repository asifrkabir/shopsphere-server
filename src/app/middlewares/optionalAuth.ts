import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { getExistingUserById } from "../modules/user/user.utils";

const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return next();
    }

    try {
      // Verify the token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { userId } = decoded;

      const existingUser = await getExistingUserById(userId);
      if (!existingUser) {
        return next();
      }

      // Attach user details to the request object
      req.user = decoded;
      return next();
    } catch (err) {
      return next();
    }
  };
};

export default optionalAuth;
