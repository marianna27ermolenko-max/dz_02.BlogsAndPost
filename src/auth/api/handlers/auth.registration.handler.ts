import { Request,  Response} from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { RequestWithBody } from "../../../common/types/requests";
import { CreateUserDto } from "../../../users/types/create.user.dto";
import { authServer } from "../../domain/auth.service";

export async function userRegistrationHandler(req: RequestWithBody<CreateUserDto>, res: Response){

     console.log("HANDLER START");
try{

const { login, password, email } = req.body; 

const result = await authServer.registrationUser({login, password, email});
console.log(result)
if(!result) return res.sendStatus(HttpStatus.BAD_REQUEST) //ПЕРЕПИСАТЬ ПОТОМ КОГДА СДЕЛАЮ ОТВЕТ С ОБЬЕКТ РЕЗАЛТ

res.sendStatus(HttpStatus.NO_CONTENT);

}catch(e: unknown){
     res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
}
}