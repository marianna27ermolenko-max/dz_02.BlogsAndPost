import { Router } from "express";
import { createAuthUserHandler } from "./handlers/auth.create.login.user.handler";
import { bodyAuthValidation } from "./middlewares/body.auth.validation";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { getAuthUserHandler } from "./handlers/auth.get.me.handler";
import { jwtTokenGuardMiddleware } from "../guard/jwt.token.guard-middleware";

export const authRouter = Router();

authRouter
.post(
  '/login', bodyAuthValidation, inputValidationResultMiddleware, createAuthUserHandler)
.get(
  '/me', jwtTokenGuardMiddleware, inputValidationResultMiddleware, getAuthUserHandler)
