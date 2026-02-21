import { Response, Request } from "express";
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
){
  try {
    const id = req.params.id;
    const post = await postsRepository.findPostById(id);
    if (!post){
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await postsRepository.deletePost(id);
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
