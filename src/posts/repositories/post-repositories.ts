import { db } from "../../db/in.memory.db";
import { PostViewModel } from "../types/post.type";
import { PostInputModel } from "../dto/post.dto.view.input";


export const postsRepository = {

findAllPosts(): PostViewModel[]{
return db.posts;
},

findPostById(id: string): PostViewModel | null{
return db.posts.find(n => n.id === id) ?? null;
},

createPost(newBlog: PostViewModel): PostViewModel{
db.posts.push(newBlog);
return newBlog;
},

updatePost(id: string, dto: PostInputModel): boolean {

    const blog = db.posts.find(n => n.id === id);
    if(!blog){
    return false;
    };

    blog.title= dto.title; 
    blog.shortDescription = dto.shortDescription; 
    blog.content = dto.content;
    blog.blogId = dto.blogId;

    return true;
},

deleteBlog(id: string): boolean {

    const index = db.posts.findIndex((v) => v.id === id);

    if(index === -1){
    return false 
    };

    db.posts.splice(index, 1);
    return true;
},
};