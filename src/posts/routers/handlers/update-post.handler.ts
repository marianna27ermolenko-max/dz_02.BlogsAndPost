import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { PostInputModel } from "../../dto/post.dto.view.input";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";
import { blogsRepository } from "../../../blogs/repositories/blogs-repositories";

export async function updatePostHandler (req: Request<{id: string}, {}, PostInputModel>, res: Response){
try{
   const id = req.params.id;
   const post =  await postsRepository.findPostById(id);
   
   if(!post){
   return res.sendStatus(HttpStatus.NOT_FOUND)}

   const blog = await blogsRepository.findBlogById(req.body.blogId);
    if(!blog){
   return res.status(HttpStatus.BAD_REQUEST).json(
              APIErrorResult([{field: 'blogId', message: 'Blog not found' }])
            )}

   const dto = { 
   title: req.body.title,
   shortDescription: req.body.shortDescription,
   content: req.body.content,
   blogId: req.body.blogId,
   };

   await postsRepository.updatePost(id, dto);
   res.sendStatus(HttpStatus.NO_CONTENT); 
} catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

