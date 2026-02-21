import { Response, Request } from "express";
import { blogsRepository } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { BlogInputModel } from "../../dto/blog.dto.model";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogInputModel>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const blogReal = await blogsRepository.findBlogById(id);

    if (!blogReal) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    const dto: BlogInputModel = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

 await blogsRepository.updateBlog(id, dto);
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (err: unknown){
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
