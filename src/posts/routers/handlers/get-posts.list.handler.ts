import { Response, Request } from "express"; 
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export async function getPostListHandler(req: Request, res: Response){
try{
const allPost = await postsRepository.findAllPosts();
res.status(HttpStatus.OK).json(allPost);   
} catch (err: any){
  res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}} 