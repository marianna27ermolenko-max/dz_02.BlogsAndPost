import { Blog } from "../blogs/types/blog.type";
import { Post } from "../posts/types/post.type";
import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from "../core/settings/setting";

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

//обьявляем переменные которые будут доступны во всем проекте
export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

//подключение к бд
export async function runDB(url: string): Promise<void>{

  client = new MongoClient(url); //поддготовка к соединению
  const db: Db = client.db(SETTINGS.DB_NAME); //подключение к базе данных

  //инициализация коллекций - создаем доступ к колекциям - после этого можно применять методы - напр -  await blogCollection.insertOne(blog)
  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);

  try{
    await client.connect(); //Вот здесь происходит реальное подключение к MongoDB серверу.
    await db.command({ ping: 1 }); //Проверка соединения
    console.log('Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error('Database not conected');
  }
}
