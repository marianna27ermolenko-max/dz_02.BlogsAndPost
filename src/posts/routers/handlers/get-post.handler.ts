import { Response, Request } from "express";
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const getIdPost = await postsRepository.findPostById(id);

    if (!getIdPost) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    res.status(HttpStatus.OK).json(getIdPost);
  } catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
