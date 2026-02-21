import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";

export async function deleteBlogHandler(req: Request<{id: string}>, res: Response){
try{
        const id = req.params.id;
        const deleteBlog = await blogsRepository.findBlogById(id);

        if(!deleteBlog){
            res.status(HttpStatus.NOT_FOUND).send(
              APIErrorResult([{field: 'id', message: 'Blog not found' }])
            );
            return;
        }
         await blogsRepository.deleteBlog(id);
         res.sendStatus(HttpStatus.NO_CONTENT);
} catch (err: any){
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}}