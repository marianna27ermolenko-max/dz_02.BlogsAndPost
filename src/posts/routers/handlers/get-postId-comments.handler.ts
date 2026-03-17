import { Response } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { RequestWithParamsAndQuery } from "../../../common/types/requests";
import { PostIdType } from "../../../common/types/id";
import { CommentsQueryInput } from "../input/post-comments-query.input";
import { matchedData } from "express-validator";
import { setDefaultPostPagination } from "../../../common/helpers/set-default-post-sort-and-pagination";
import { CommentSortField } from "../input/comment-sort-field";
import { postsQwRepository } from "../../repositories/post-query.repositories";

export async function getByPostIdCommentHandler(
  req: RequestWithParamsAndQuery<PostIdType, CommentsQueryInput>,
  res: Response,
) {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    const post = await postsQwRepository.findPostById(postId);
    if(!post) return res.sendStatus(HttpStatus.NOT_FOUND);

    const sanitazedQuery = matchedData<CommentsQueryInput>(req, {
      locations: ["query"], // - "Бери данные только из req.query"
      includeOptionals: true, // - Верни даже необязательные поля, если они есть
    });

    const pagination = setDefaultPostPagination<CommentSortField>(sanitazedQuery);

    const listComments =  await postsQwRepository.findManyCommentsByPostId( postId, pagination );

    console.log(listComments)

    return res.status(HttpStatus.OK).json(listComments);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
