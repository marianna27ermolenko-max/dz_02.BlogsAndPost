import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { mapToBlogViewModel } from "../mappers/map-blog-view-model";


export async function getBlogsListHandler(req: Request, res: Response){

  try{
    const allBlogs = await blogsRepository.findAllBlogs();
    const BlogsViewModels = allBlogs.map(mapToBlogViewModel)
    res.status(HttpStatus.OK).json(BlogsViewModels);
  } catch (err: unknown){
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}