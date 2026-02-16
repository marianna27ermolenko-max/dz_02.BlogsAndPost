import { db } from "../../db/in.memory.db";
import { Blog, BlogViewModel } from "../types/blog.type";
import { BlogInputModel } from "../dto/blog.dto.model";

export const blogsRepository = {

findAllBlogs(): BlogViewModel[]{
return db.blogs;
},

findBlogById(id: string): BlogViewModel | null{
return db.blogs.find(n => n.id === id) ?? null;
},

createBlog(newBlog: Blog): BlogViewModel{
    
db.blogs.push(newBlog);
return newBlog;
},

updateBlog(id: string, dto: BlogInputModel):boolean {

    const blog = db.blogs.find(n => n.id === id);
    if(!blog){
    return false
    };

    blog.name = dto.name; 
    blog.description = dto.description; 
    blog.websiteUrl = dto.websiteUrl;

    return true;
},

deleteBlog(id: string): boolean{

    const index = db.blogs.findIndex((v) => v.id === id);

    if(index === -1){
    return false;  
    };

    db.blogs.splice(index, 1);
    return true;
},
};

