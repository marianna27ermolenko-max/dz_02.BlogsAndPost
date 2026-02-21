import { Blog, BlogViewModel } from "../../types/blog.type";
import { WithId } from "mongodb";

export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
  return {
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
};
}