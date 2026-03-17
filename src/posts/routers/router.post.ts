import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/guard/super-admin.guard-middleware';
import { idValidation, postIdValidation } from '../../common/middlewareValidation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../common/middlewareValidation/input-validtion-result.middleware';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { getPostListHandler } from './handlers/get-posts.list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { commentByPostIdInputValidationMiddleware, postInputValidationMiddleware } from '../validation/post.body-validation-middleware';
import { paginationAndSortingValidation } from '../../common/middlewareValidation/query.pagination-sorting';
import { PostSortField } from './input/post-sort-field';
import { getByPostIdCommentHandler } from './handlers/get-postId-comments.handler';
import { createByPostIdCommentHandler } from './handlers/create-postId-comment.handler';
import { jwtTokenGuardMiddleware } from '../../auth/guard/jwt.token.guard-middleware';
import { CommentSortField } from './input/comment-sort-field';

export const postsRouter = Router();

postsRouter 
.get('/', paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, getPostListHandler)
.get('/:postId/comments', postIdValidation, paginationAndSortingValidation(CommentSortField), inputValidationResultMiddleware, getByPostIdCommentHandler)
.post('/:postId/comments', jwtTokenGuardMiddleware, postIdValidation, commentByPostIdInputValidationMiddleware, inputValidationResultMiddleware, createByPostIdCommentHandler)
.post('/', superAdminGuardMiddleware, postInputValidationMiddleware, inputValidationResultMiddleware, createPostHandler)
.get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)
.put('/:id', superAdminGuardMiddleware, idValidation, postInputValidationMiddleware, inputValidationResultMiddleware, updatePostHandler)
.delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostHandler)