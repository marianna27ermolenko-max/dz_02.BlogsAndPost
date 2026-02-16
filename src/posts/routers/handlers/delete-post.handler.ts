import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export const deletePostHandler = 
(req: Request, res: Response) => {

const id = req.params.id.toString();   

const delPost = postsRepository.deleteBlog(id)
res.sendStatus(HttpStatus.NO_CONTENT);   
}  