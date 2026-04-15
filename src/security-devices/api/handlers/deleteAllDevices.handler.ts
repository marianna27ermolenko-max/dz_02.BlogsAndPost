import { Response, Request } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { securityDevicesService } from "../../domain/security-devices.service";


export async function deleteAllDevicesHandler(req: Request, res: Response){

    try {

    const userId = req.userId;
    const refreshToken = req.cookies.refreshToken;
    const deleteSessions = await securityDevicesService.deleteDevices(userId!, refreshToken);
    if(!deleteSessions) return res.sendStatus(HttpStatus.UNAUTHORIZED);

    res.sendStatus(HttpStatus.NO_CONTENT);
    
    }catch(e: any){
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

