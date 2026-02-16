import { validationResult, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../types/http.status'; 

//используется в роутере после всех body() проверок
const formatErrors = (error: any) => ({
  field: error.param,  // Поле с ошибкой
  message: error.msg,  // Сообщение ошибки
});
 
export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).formatWith(formatErrors).array();
 
  if (errors.length) {
    return res.status(HttpStatus.BAD_REQUEST).json({ errorMessages: errors });
  }
 
  next(); // Если ошибок нет, передаём управление дальше
};