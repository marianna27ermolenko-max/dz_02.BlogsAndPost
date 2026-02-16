import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const getPostHandler = 
(req: Request, res: Response) => {

const id = req.params.id.toString();   

const getIdPost = postsRepository.findPostById(id)
res.status(HttpStatus.OK).json(getIdPost);   
}  