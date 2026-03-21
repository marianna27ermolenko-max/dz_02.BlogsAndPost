import { Request,  Response} from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { authServer } from "../../domain/auth.service";

export async function userRegistrationConfirmationHandler(req: Request<{},{},{code: string}>, res: Response){
try{

const code = req.body.code;
const confirmCode =  await authServer.confirmEmail(code);
if(!confirmCode) return res.sendStatus(HttpStatus.BAD_REQUEST);

res.sendStatus(HttpStatus.NO_CONTENT);
}catch(e: unknown){
     res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}
}