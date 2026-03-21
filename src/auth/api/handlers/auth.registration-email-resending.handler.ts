import { Request,  Response} from "express";
import { HttpStatus } from "../../../common/types/http.status";

export async function userReplayRegistrationHandler(req: Request, res: Response){
try{}catch(e: unknown){
     res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}
}