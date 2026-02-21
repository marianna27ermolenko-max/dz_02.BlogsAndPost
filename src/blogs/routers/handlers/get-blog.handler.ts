import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export async function getBlogHandler(req: Request<{id: string}>, res: Response){
try{
      const id = req.params.id;
      const blog = await blogsRepository.findBlogById(id);
      if (!blog) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json(blog);
    } catch (err: unknown){
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }