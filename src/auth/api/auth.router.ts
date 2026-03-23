import { Router } from "express";
import { createAuthUserHandler } from "./handlers/auth.create.login.user.handler";
import { bodyAuthRegistration, bodyAuthValidation, codeValidation, emailValidation } from "./middlewares/body.auth.validation";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { getAuthUserHandler } from "./handlers/auth.get.me.handler";
import { jwtTokenGuardMiddleware } from "../guard/jwt.token.guard-middleware";
import { userRegistrationHandler } from "./handlers/auth.registration.handler";
import { registrationEmailResendingHandler } from "./handlers/auth.registration-email-resending.handler";
import { userRegistrationConfirmationHandler } from "./handlers/auth.registration-confirmation.handler";

export const authRouter = Router();

authRouter
.post('/login', bodyAuthValidation, inputValidationResultMiddleware, createAuthUserHandler)
.post('/registration-confirmation', codeValidation, inputValidationResultMiddleware, userRegistrationConfirmationHandler)
.post('/registration', bodyAuthRegistration, inputValidationResultMiddleware, userRegistrationHandler) 
.post('/registration-email-resending', emailValidation, registrationEmailResendingHandler)
.get('/me', jwtTokenGuardMiddleware, inputValidationResultMiddleware, getAuthUserHandler)
