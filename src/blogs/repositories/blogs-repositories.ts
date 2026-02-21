import { Blog } from "../types/blog.type";
import { BlogInputModel } from "../dto/blog.dto.model";
import { blogCollection } from "../../db/mongo.db";
import { WithId, ObjectId } from "mongodb";

export const blogsRepository = {

async findAllBlogs(): Promise<WithId<Blog>[]> {
return blogCollection.find().toArray();
},

async findBlogById(id: string): Promise<WithId<Blog> | null>{
return blogCollection.findOne({_id: new ObjectId(id)})
},

async createBlog(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return {...newBlog, _id: insertResult.insertedId};
},

async updateBlog(id: string, dto: BlogInputModel): Promise<void>{

    const updateResult = await blogCollection.updateOne(
     {_id: new ObjectId(id)},
     { $set: {
    name: dto.name, 
    description: dto.description, 
    websiteUrl: dto.websiteUrl,
     }}
    )
   
    if(updateResult.matchedCount < 0){

    throw new Error('Blog not exist')
    }

    return;
},

async deleteBlog(id: string): Promise<void>{ 

const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});

if(deleteResult.deletedCount === 0){
    throw new Error('Blog not exist')
}
    return;
},
};

