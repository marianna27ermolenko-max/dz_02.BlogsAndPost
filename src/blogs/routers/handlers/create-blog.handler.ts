import { Response, Request } from "express";
import { blogsRepository } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { Blog } from "../../types/blog.type";
import { db } from "../../../db/in.memory.db";
import { mapToBlogOutput } from "../mappers/map-blog.output";

export const createBlogHandler = (req: Request, res: Response) => {

  const newBlog: Blog = blogsRepository.createBlog({
    id:(db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1 ).toString(),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  });

  const viewBlog = mapToBlogOutput(newBlog);
  res.status(HttpStatus.CREATED).json(viewBlog);
};
