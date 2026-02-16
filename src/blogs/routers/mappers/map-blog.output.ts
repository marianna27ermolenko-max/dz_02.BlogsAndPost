import { Blog, BlogViewModel } from "../../types/blog.type";

export const mapToBlogOutput = (blog: Blog): BlogViewModel => ({
  id: blog.id,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl
});