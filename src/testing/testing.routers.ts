import { Router, Response, Request } from 'express';
import { db } from '../db/in.memory.db';
import { HttpStatus } from '../core/types/http.status';

export const testingRouter = Router();

testingRouter
   .delete("/all-data", (req: Request, res: Response) => {
   db.blogs = [];
   db.posts = []; //посты надо затирать???
   res.sendStatus(HttpStatus.NO_CONTENT);
});