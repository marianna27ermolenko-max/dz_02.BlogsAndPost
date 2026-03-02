import { Response, Request } from "express"; 
import { HttpStatus } from "../../../core/types/http.status";
import { PostInputModel } from "../../dto/post.dto.view.input";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";
import { postsService } from "../../application/posts.service";
import { blogsService } from "../../../blogs/application/blogs.service";

export async function updatePostHandler (req: Request<{id: string}, {}, PostInputModel>, res: Response){
try{
   const id = req.params.id;
   const post =  await postsService.findPostById(id);
   
   if(!post){
   return res.sendStatus(HttpStatus.NOT_FOUND)}

   const blog = await blogsService.findByIdOrFail(req.body.blogId);
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

   await postsService.updatePost(id, dto);
   res.sendStatus(HttpStatus.NO_CONTENT); 
} catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

