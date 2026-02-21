import { Response, Request } from "express";
import { blogsRepository } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { Blog } from "../../types/blog.type";
import { mapToBlogViewModel } from "../mappers/map-blog-view-model";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";
import { BlogInputModel } from "../../dto/blog.dto.model";

export async function createBlogHandler(req: Request<{}, {}, BlogInputModel>, res: Response){

  try{
    const newBlog: Blog = {   
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toString(),
    isMembership: true,
  }
  
  const createBlog = await blogsRepository.createBlog(newBlog);
  const BlogViewModel = mapToBlogViewModel(createBlog);
  res.status(HttpStatus.CREATED).json(BlogViewModel);

} catch (err: any){
const errors = [
  {
     message: err.message ?? "Unknown error",
     field: "blog",
  }
]
res.status(HttpStatus.BAD_REQUEST).json(APIErrorResult(errors)) 
};
}  