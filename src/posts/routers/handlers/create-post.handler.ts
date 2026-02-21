import { Response, Request } from "express";
import { postsRepository } from "../../repositories/post-repositories";
import { HttpStatus } from "../../../core/types/http.status";
import { blogsRepository } from "../../../blogs/repositories/blogs-repositories";
import { mapToPostViewMolel } from "../mappers/map-to-post-model";
import { APIErrorResult } from "../../../core/utils/APIErrorResult";

export async function createPostHandler(req: Request, res: Response) {
  try {
    const blogId = req.body.blogId;
    const blog = await blogsRepository.findBlogById(blogId);

    if (!blog) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        APIErrorResult([
          {
            message: "Blog not found",
            field: "id",
          },
        ]),
      );
    }

    const newPost = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blogId.name,
      createdAt: new Date().toString()
    };

    const createPost = await postsRepository.createPost(newPost)
    const PostViewModel = mapToPostViewMolel(createPost)
    res.status(HttpStatus.OK).json(PostViewModel)
  } catch (err: unknown){
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
