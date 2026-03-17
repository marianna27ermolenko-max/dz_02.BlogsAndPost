import { Response } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { RequestWithParamsAndBody } from "../../../common/types/requests";
import { PostIdType } from "../../../common/types/id";
import { CommentBodyByPost } from "../input/post-comments-body";
import { usersService } from "../../../users/domain/users.service";
import { usersQwRepository } from "../../../users/infrastructure/user.query.repository";
import { postsService } from "../../domain/posts.service";
import { postsQwRepository } from "../../repositories/post-query.repositories";

export async function createByPostIdCommentHandler(req: RequestWithParamsAndBody<PostIdType, CommentBodyByPost>, res: Response){

    try{
    const postId = req.params.postId;

    const correctUser = await usersQwRepository.findUserById(req.userId!);
    if(!correctUser) return res.sendStatus(HttpStatus.UNAUTHORIZED);

    const post = await postsService.findPostById(req.params.postId);
    if(!post) return res.sendStatus(HttpStatus.NOT_FOUND);

    const newComment = {
        content: req.body.content,
        postId,
        commentatorInfo: {
            userId: req.userId!,
            userLogin: correctUser.login,
        },
        createdAt: new Date().toISOString()
    }

    const createComment = await postsService.createCommentByPostId(newComment); //здесь словили нашу айдишку и гоу в гет
    const comment = await postsQwRepository.findCommentById(createComment);

    res.status(HttpStatus.CREATED).json(comment);
        
    }catch(e: unknown){
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}