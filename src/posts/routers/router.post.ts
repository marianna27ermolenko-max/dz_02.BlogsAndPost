import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middleware/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewareValidation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewareValidation/input-validtion-result.middleware';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { getPostListHandler } from './handlers/get-posts.list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { postInputValidationMiddleware } from '../validation/post.body-validation-middleware';

export const postsRouter = Router();

postsRouter 
.get('/', getPostListHandler)
.post('/', superAdminGuardMiddleware, postInputValidationMiddleware, inputValidationResultMiddleware, createPostHandler)
.get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
.put('/:id', superAdminGuardMiddleware, idValidation, postInputValidationMiddleware, inputValidationResultMiddleware, updatePostHandler)
.delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostHandler)