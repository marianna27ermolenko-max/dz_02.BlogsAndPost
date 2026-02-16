import { body } from "express-validator";

export const  titlePostValidation = body('title')
.exists().withMessage('Title is required')
.isString().withMessage('Title must be a string')
.isLength({min: 1, max: 30}).withMessage('Title cannot be longer than 30 characters')
.trim().notEmpty().withMessage('Title can not be empty')

export const shortDescriptionPostValidation = body('shortDescription')
.exists().withMessage('ShortDescription is required')
.isString().withMessage('ShortDescription must be a string')
.isLength({min: 1, max: 100}).withMessage('ShortDescription cannot be longer than 100 characters')
.trim().notEmpty().withMessage('ShortDescription can not be empty')

export const contentPostValidation = body('content')
.exists().withMessage('Content is required')
.isString().withMessage('Content must be a string')
.isLength({min: 1, max: 1000}).withMessage('Content cannot be longer than 1000 characters')
.trim().notEmpty().withMessage('Content can not be empty')

export const blogIdPostValidation = body('blogId')
.exists().withMessage('BlogId is required')
.isString().withMessage('BlogId must be a string')
.isLength({min: 1, max: 100}).withMessage('BlogId cannot be longer than 100 characters')
.trim().notEmpty().withMessage('BlogId can not be empty')

export const postInputValidationMiddleware = [
titlePostValidation, shortDescriptionPostValidation, contentPostValidation, blogIdPostValidation
]