import { BlogViewModel } from "../blogs/types/blog.type";
import { PostViewModel } from "../posts/types/post.type";

export const db = {

blogs: <BlogViewModel[]>[

    {
      id: "1",
      name: "Tech Insights",
      description: "Блог о современных технологиях и разработке",
      websiteUrl: "https://techinsights.dev",
    },
    {
      id: "2",
      name: "Travel Stories",
      description: "Истории о путешествиях по всему миру",
      websiteUrl: "https://travelstories.com",
    },
    {
      id: "3",
      name: "Food Lovers",
      description: "Рецепты и обзоры вкусной еды",
      websiteUrl: "https://foodlovers.blog",
    },
],

posts: <PostViewModel[]>[
{
      id: "101",
      title: "Что такое TypeScript?",
      shortDescription: "Краткий обзор языка TypeScript",
      content: "TypeScript — это надстройка над JavaScript, добавляющая типизацию.",
      blogId: "1",
      blogName: "Tech Insights",
    },
    {
      id: "102",
      title: "Лучшие фреймворки 2025 года",
      shortDescription: "Обзор популярных JS-фреймворков",
      content: "React, Vue и Angular продолжают доминировать на рынке.",
      blogId: "1",
      blogName: "Tech Insights",
    },
    {
      id: "201",
      title: "Путешествие в Японию",
      shortDescription: "Мой опыт поездки в Токио и Киото",
      content: "Япония — удивительная страна с богатой культурой.",
      blogId: "2",
      blogName: "Travel Stories",
    },
    {
      id: "301",
      title: "Идеальная паста карбонара",
      shortDescription: "Классический рецепт итальянской пасты",
      content: "Для приготовления понадобится бекон, яйца и пармезан.",
      blogId: "3",
      blogName: "Food Lovers",
    },
],
};