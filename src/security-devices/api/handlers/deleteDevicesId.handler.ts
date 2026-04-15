import { Response, Request } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { securityDevicesService } from "../../domain/security-devices.service";
import { ResultStatus } from "../../../common/result/resultCode";

export async function deleteDeviceHandler(req: Request, res: Response){

    try {
    const deviceId = req.params.deviceId as string;    
    const userId = req.userId;

    const deleteSession = await securityDevicesService.deleteDevicesWithDeviceId(userId!, deviceId);
    if(deleteSession.status === ResultStatus.Unauthorized) return res.sendStatus(HttpStatus.UNAUTHORIZED);
    if(deleteSession.status === ResultStatus.Forbidden) return res.sendStatus(HttpStatus.FORBIDDEN); 
    if(deleteSession.status === ResultStatus.NotFound) return res.sendStatus(HttpStatus.NOT_FOUND); 
    if(deleteSession.status === ResultStatus.Success) return res.sendStatus(HttpStatus.NO_CONTENT); 
    
    }catch(e: any){
    
        return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}