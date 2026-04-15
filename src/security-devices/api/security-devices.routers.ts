import { Router } from "express";
import { deleteAllDevicesHandler } from "./handlers/deleteAllDevices.handler";
import { deleteDeviceHandler } from "./handlers/deleteDevicesId.handler";
import { getDevicesHandler } from "./handlers/getDevices.handler";
import { jwtRefreshTokenGuardMiddleware } from "../../auth/guard/jwt.refresh.token.guard-middleware";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { deviceIdValidation } from "../../common/middlewareValidation/params-id.validation-middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter
.get('/', jwtRefreshTokenGuardMiddleware, inputValidationResultMiddleware, getDevicesHandler)
.delete('/', jwtRefreshTokenGuardMiddleware, inputValidationResultMiddleware, deleteAllDevicesHandler)
.delete('/:deviceId', deviceIdValidation, jwtRefreshTokenGuardMiddleware, inputValidationResultMiddleware, deleteDeviceHandler)