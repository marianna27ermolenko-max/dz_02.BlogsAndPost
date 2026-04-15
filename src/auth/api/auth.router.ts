import { Router } from "express";
import { createAuthUserHandler } from "./handlers/auth.create.login.user.handler";
import { bodyAuthRegistration, bodyAuthValidation, codeValidation, emailValidation } from "./middlewares/body.auth.validation";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { getAuthUserHandler } from "./handlers/auth.get.me.handler";
import { jwtTokenGuardMiddleware } from "../guard/jwt.token.guard-middleware";
import { userRegistrationHandler } from "./handlers/auth.registration.handler";
import { registrationEmailResendingHandler } from "./handlers/auth.registration-email-resending.handler";
import { userRegistrationConfirmationHandler } from "./handlers/auth.registration-confirmation.handler";
import { logoutHandler } from "./handlers/auth.logout.handler";
import { createRefreshTokenHandler } from "./handlers/auth.refresh-token.handler";
import { jwtRefreshTokenGuardMiddleware } from "../guard/jwt.refresh.token.guard-middleware";
import { customRateLimit } from "../../common/custom-rate-limit/middleware/customRateLimit.middleware";

export const authRouter = Router();

authRouter
.post('/login', customRateLimit, bodyAuthValidation, inputValidationResultMiddleware, createAuthUserHandler)
.post('/registration-confirmation',  customRateLimit, codeValidation, inputValidationResultMiddleware, userRegistrationConfirmationHandler)
.post('/registration',  customRateLimit, bodyAuthRegistration, inputValidationResultMiddleware, userRegistrationHandler) 
.post('/registration-email-resending',  customRateLimit, emailValidation, registrationEmailResendingHandler)
.post('/logout', jwtRefreshTokenGuardMiddleware, inputValidationResultMiddleware, logoutHandler)
.post('/refresh-token', jwtRefreshTokenGuardMiddleware, inputValidationResultMiddleware, createRefreshTokenHandler)
.get('/me', jwtTokenGuardMiddleware, inputValidationResultMiddleware, getAuthUserHandler)
