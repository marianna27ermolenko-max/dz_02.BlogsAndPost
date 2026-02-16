import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { BlogInputModel } from "../../dto/blog.dto.model";


export const updateBlogHandler =  (req: Request, res: Response) => {
      const id = req.params.id.toString();
      const dto: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
      };

      const updBlog = blogsRepository.updateBlog(id, dto);

      if (!updBlog) {
        res.sendStatus(HttpStatus.NOT_FOUND);
      }
      res.sendStatus(HttpStatus.NO_CONTENT);
    }