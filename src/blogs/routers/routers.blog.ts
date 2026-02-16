import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import { idValidation } from "../../core/middlewareValidation/params-id.validation-middleware";
import { blogInputDTOValidationMiddleware } from "../validation/blog.body-validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewareValidation/input-validtion-result.middleware";
import { getBlogsListHandler } from "./handlers/get-blogs.list.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";

export const blogsRouter = Router();

blogsRouter
  .get("/", getBlogsListHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    blogInputDTOValidationMiddleware,
    inputValidationResultMiddleware,
    createBlogHandler
  )
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    getBlogHandler
  )
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogInputDTOValidationMiddleware,
    inputValidationResultMiddleware,
    updateBlogHandler
  )
  .delete(
    '/:id',
     superAdminGuardMiddleware, 
     idValidation, 
     inputValidationResultMiddleware, 
     deleteBlogHandler)


