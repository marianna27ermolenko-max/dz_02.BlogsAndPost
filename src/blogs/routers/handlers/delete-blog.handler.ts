import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const deleteBlogHandler = (req: Request, res: Response) => {

        const id = req.params.id.toString();
        const delBlog = blogsRepository.deleteBlog(id);

        if(!delBlog){
            res.sendStatus(HttpStatus.NOT_FOUND);
        }

         res.sendStatus(HttpStatus.NO_CONTENT);
     }