import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db/mongo.db";
import { usersQwRepository } from "../../users/infrastructure/user.query.repository";
import { commentsQrRepository } from "../infrastructure/comments.query.repository";
import { commentsRepository } from "../infrastructure/comments.repository";
import { CommentBodyDto } from "../types/comment.body.dto";
import { ICommentDB } from "../types/comment.db.interface";
import { ICommentView } from "../types/comment.view.model";

export const commentsServer = {

async updateCommentCommentId(id: string, dto: CommentBodyDto): Promise<boolean>{ 

const comment = await commentsRepository.findCommentById(id);
if(!comment) return false;

const updateComment = await commentsRepository.updateCommentByCommentId(id, dto);
return updateComment;
},  
    
async deleteCommentCommentId(id: string): Promise<boolean>{ 
const deleteComment =  await commentsRepository.deleteCommentByCommentId(id);
return deleteComment;

},  

async getUserByUserId(userId: string): Promise<boolean>{
    const user = await usersQwRepository.findUserByUserId(userId);
    if(!user) return false;
    return true;
  },

async getCommentById(id: string): Promise<ICommentView | null>{
  const comment = await commentsQrRepository.getCommentById(id);
  if(!comment) return null;
  return comment;
},

// async checkUserIdWithComment(userId: string, commentId: string): Promise<boolean>{
//   const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
//   if(!comment || userId !== comment.commentatorInfo.userId) return false;
//   return true;
// },

}

