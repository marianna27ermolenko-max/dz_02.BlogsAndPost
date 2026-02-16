import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { blogsRepository } from "../../../blogs/repositories/blogs-repositories";

export const updatePostHandler = 
(req: Request, res: Response) => {

   const id = req.params.id.toString();

   const blog =  blogsRepository.findBlogById(req.body.blogId);
   
   if(!blog){
   return res.sendStatus(HttpStatus.BAD_REQUEST);
   }

   const UpdatePost = postsRepository.updatePost(id, { 
   title: req.body.title,
   shortDescription: req.body.shortDescription,
   content: req.body.content,
   blogId: req.body.blogId,
   });

   if(!UpdatePost){
      return res.sendStatus(HttpStatus.NOT_FOUND)
   }

res.sendStatus(HttpStatus.NO_CONTENT)   
}  
