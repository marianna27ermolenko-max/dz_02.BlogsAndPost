import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../common/types/http.status";
import { jwtService } from "../adapters/jwt.service";
import { usersRepository } from "../../users/infrastructure/user.repository";
import { sessionsRepository } from "../../security-devices/infrastructure/security-devices.repository";

export const jwtRefreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {                                    
    
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(HttpStatus.UNAUTHORIZED);

  const payload = await jwtService.checkRefreshToken(refreshToken);
  if (!payload){ return res.sendStatus(HttpStatus.UNAUTHORIZED); }

  const { userId, deviceId, iat } = payload;

  const user = await usersRepository.findById(userId); 
  if (!user) { return res.sendStatus(HttpStatus.UNAUTHORIZED); }

  const session = await sessionsRepository.findSession(deviceId);

  if(!session){ return res.sendStatus(HttpStatus.UNAUTHORIZED); } //как тут быть со статусами быть 
  if(session.lastActiveDate !== new Date(iat * 1000).toISOString()){ return res.sendStatus(HttpStatus.UNAUTHORIZED); }

  req.userId = user._id.toString();
  
  next();
};
