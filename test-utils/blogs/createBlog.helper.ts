import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../src/auth/guard/super-admin.guard-middleware";
import { BlogInputModel } from "../../src/blogs/dto/blog.dto.model";
import request  from "supertest";
import { Express } from 'express';
import { HttpStatus } from "../../src/common/types/http.status";
import { BlogViewModel } from "../../src/blogs/types/blog.type";
import { BLOGS_PATH } from "../../src/common/paths/path";

export const createBlog = async (app: Express, dtoBlog: BlogInputModel, expectedStatus: HttpStatus = HttpStatus.CREATED): Promise<BlogViewModel> =>{

//   const { name, description, websiteUrl } = dtoBlog;

  const res = await request(app)
                    .post(BLOGS_PATH)
                    .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
                    .send(dtoBlog)
                    .expect(expectedStatus)
                    return res.body;  //возвращаем боди (лежит объект созданный сервером) так как надо потом использовать напр айдишку для других операций
}