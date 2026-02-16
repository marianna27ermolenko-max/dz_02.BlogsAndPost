import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const updatePostHandler = 
(req: Request, res: Response) => {

   const id = req.params.id.toString();

   const UpdatePost = postsRepository.updatePost(id, { 
   title: req.body.title,
   shortDescription: req.body.shortDescription,
   content: req.body.content,
   blogId: req.body.blogId,
   });

res.sendStatus(HttpStatus.NO_CONTENT)   
}  
