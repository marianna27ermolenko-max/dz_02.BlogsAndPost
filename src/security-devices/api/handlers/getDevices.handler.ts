import { Response, Request } from "express";
import { HttpStatus } from "../../../common/types/http.status";

export async function getDevicesHandler(req: Request, res: Response){

    try {
    
    
    }catch(e: any){
    
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}