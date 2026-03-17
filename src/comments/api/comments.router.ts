import { Router } from "express";
import { updateCommentHandler } from "./handlers/update.comment.handler";
import { deleteCommentHandler } from "./handlers/delete.comment.handler";
import { getCommentHandler } from "./handlers/get.comment.id.handler";
import { jwtTokenGuardMiddleware } from "../../auth/guard/jwt.token.guard-middleware";
import { inputValidationResultMiddleware } from "../../common/middlewareValidation/input-validtion-result.middleware";
import { commentIdValidation, idValidation } from "../../common/middlewareValidation/params-id.validation-middleware";
import { commentByPostIdInputValidationMiddleware } from "../../posts/validation/post.body-validation-middleware";

export const commentsRouter = Router();

commentsRouter
.get('/:id', idValidation, getCommentHandler)
.put('/:commentId', jwtTokenGuardMiddleware, commentIdValidation, commentByPostIdInputValidationMiddleware, inputValidationResultMiddleware, updateCommentHandler)
.delete('/:commentId', jwtTokenGuardMiddleware, commentIdValidation, inputValidationResultMiddleware, deleteCommentHandler)