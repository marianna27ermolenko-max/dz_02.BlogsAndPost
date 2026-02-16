import express, { Express, Request, Response } from 'express';
import { blogsRouter } from './blogs/routers/routers.blog'; 
import { postsRouter } from './posts/routers/router.post';
import { testingRouter } from './testing/testing.routers';
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from './core/paths/path';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello users!');
});

app.use(BLOGS_PATH, blogsRouter);
app.use(POSTS_PATH, postsRouter);
app.use(TESTING_PATH, testingRouter);


 setupSwagger(app);
 return app;
}

