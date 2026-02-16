import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const getBlogHandler = (req: Request, res: Response) => {
      const id = req.params.id.toString();
      const blog = blogsRepository.findBlogById(id);
      if (!blog) {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json(blog);
    }