import { body } from "express-validator";

export const nameBlogValidation = body('name')
.exists().withMessage('Name is required')
.isString().withMessage('Name must be a string')
.isLength({min: 1, max: 15}).withMessage('Name cannot be longer than 15 characters')
.trim().notEmpty().withMessage('Name can not be empty')

export const  descriptionBlogValidation = body('description')
.exists().withMessage('Description is required')
.isString().withMessage('Description must be a string')
.isLength({min: 1, max: 500}).withMessage('Description cannot be longer than 500 characters')
.trim().notEmpty().withMessage('Description can not be empty')

export const  websiteUrlBlogValidation = body('websiteUrl')
.exists().withMessage('WebsiteUrl is required')
.isString().withMessage('WebsiteUrl must be a string')
.isLength({min: 1, max: 100}).withMessage('WebsiteUrl cannot be longer than 100 characters')
.trim().notEmpty().withMessage('WebsiteUrl can not be empty')
.matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('WebsiteUrl must match the address template')


export const blogInputDTOValidationMiddleware = [
nameBlogValidation, descriptionBlogValidation, websiteUrlBlogValidation
]