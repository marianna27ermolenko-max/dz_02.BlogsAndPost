import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { db } from "../../../db/in.memory.db";
import { HttpStatus } from "../../../core/types/http.status";

export const createPostHandler = 
(req: Request, res: Response) => {

const newPost = postsRepository.createPost({ 
   id: (db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1 ).toString(),
   title: req.body.title,
   shortDescription: req.body.shortDescription,
   content: req.body.content,
   blogId: req.body.blogId,
   blogName: req.body.blogName,});

res.status(HttpStatus.CREATED).json(newPost)   
}  
