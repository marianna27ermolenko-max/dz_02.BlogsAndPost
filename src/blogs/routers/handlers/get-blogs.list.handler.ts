import { Response, Request } from "express";
import { blogsRepository  } from "../../repositories/blogs-repositories";
import { HttpStatus } from "../../../core/types/http.status";


export const getBlogsListHandler = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json(blogsRepository.findAllBlogs());
  }