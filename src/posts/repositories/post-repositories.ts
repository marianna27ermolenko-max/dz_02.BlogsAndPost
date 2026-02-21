import { postCollection } from "../../db/mongo.db";
import { Post} from "../types/post.type";
import { PostInputModel } from "../dto/post.dto.view.input";
import { WithId, ObjectId } from "mongodb";


export const postsRepository = {

async findAllPosts(): Promise<WithId<Post>[]> {
return postCollection.find().toArray();
},

async findPostById(id: string): Promise<WithId<Post> | null> {
return postCollection.findOne({_id: new ObjectId(id)});
},

async createPost(newPost: Post): Promise<WithId<Post>> {
const insertResult = await postCollection.insertOne(newPost);
return {...newPost, _id: insertResult.insertedId}
},

async updatePost(id: string, dto: PostInputModel): Promise<void> {

    const updateResult = await postCollection.updateMany({_id: new ObjectId(id)},
    {$set: {    
    title: dto.title, 
    shortDescription: dto.shortDescription, 
    content: dto.content,
    blogId: dto.blogId,
}})
    if(updateResult.matchedCount < 1 ){
        throw new Error('Post not exist')
    };
    return;
},

async deletePost(id: string): Promise<void> {

const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});
if(deleteResult.deletedCount < 1){
throw new Error('Post not exist')
};
return;
},
};