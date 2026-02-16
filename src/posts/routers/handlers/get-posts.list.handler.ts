import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const getPostListHandler = 
(req: Request, res: Response) => {

const allPost = postsRepository.findAllPosts()
res.status(HttpStatus.OK).json(allPost);   
}  