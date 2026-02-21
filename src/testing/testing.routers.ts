import { Router, Response, Request } from 'express';
import { blogCollection, postCollection } from '../db/mongo.db';
import { HttpStatus } from '../core/types/http.status';

export const testingRouter = Router();

testingRouter
   .delete("/all-data", async (req: Request, res: Response) => {
      await Promise.all([
   blogCollection.deleteMany(),
   postCollection.deleteMany(),
   ])
   res.sendStatus(HttpStatus.NO_CONTENT);
});