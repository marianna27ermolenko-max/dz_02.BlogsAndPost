import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { db } from "../../../db/in.memory.db";
import { HttpStatus } from "../../../core/types/http.status";
import { blogsRepository } from "../../../blogs/repositories/blogs-repositories";

export const createPostHandler = 
(req: Request, res: Response) => {

const blog =  blogsRepository.findBlogById(req.body.blogId);

if(!blog){
return res.sendStatus(HttpStatus.BAD_REQUEST);
}

const newPost = postsRepository.createPost({ 
   id: (db.posts.length ? db.posts[db.posts.length - 1].id + 1 : 1 ).toString(),
   title: req.body.title,
   shortDescription: req.body.shortDescription,
   content: req.body.content,
   blogId: req.body.blogId,
   blogName: blog.name,});

res.status(HttpStatus.CREATED).json(newPost)   
}  
