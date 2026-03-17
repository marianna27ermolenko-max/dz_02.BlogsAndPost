import { CommentatorInfo } from "./commentator.db.intarface";

export interface ICommentView{
    
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
}