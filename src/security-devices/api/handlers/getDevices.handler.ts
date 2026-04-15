import { Response, Request } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { securityDevicesService } from "../../domain/security-devices.service";

export async function getDevicesHandler(req: Request, res: Response){

    try {

    const userId = req.userId;
    const sessions = await securityDevicesService.findAllDevices(userId!);

    res.status(HttpStatus.OK).json(sessions);
  
    }catch(e: any){
    
     res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}