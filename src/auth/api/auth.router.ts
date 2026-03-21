import { Router } from "express";
import { createAuthUserHandler } from "./handlers/auth.create.login.user.handler";
import { bodyAuthValidation } from "./middlewares/body.auth.validation";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { getAuthUserHandler } from "./handlers/auth.get.me.handler";
import { jwtTokenGuardMiddleware } from "../guard/jwt.token.guard-middleware";
import { userRegistrationHandler } from "./handlers/auth.registration.handler";
import { userReplayRegistrationHandler } from "./handlers/auth.registration-email-resending.handler";
import { userRegistrationConfirmationHandler } from "./handlers/auth.registration-confirmation.handler";

export const authRouter = Router();

authRouter
.post('/login', bodyAuthValidation, inputValidationResultMiddleware, createAuthUserHandler)
.post('/registration-confirmation', userRegistrationConfirmationHandler)
.post('/registration',  (req, res, next) => {
    console.log("BODY:", req.body);
    next();
  },userRegistrationHandler) //добавить валидацию, и обработку ошибок
.post('/registration-email-resending', userReplayRegistrationHandler)
.get('/me', jwtTokenGuardMiddleware, inputValidationResultMiddleware, getAuthUserHandler)
