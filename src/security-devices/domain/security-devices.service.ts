import { jwtService } from "../../auth/adapters/jwt.service";
import { Result } from "../../common/result/result.type";
import { ResultStatus } from "../../common/result/resultCode";
import { sessionsQwRepository } from "../infrastructure/security-devices.QwRepository"
import { sessionsRepository } from "../infrastructure/security-devices.repository";
import { sessionViewModel } from "../types/sessionViewModel"

export const securityDevicesService = {

    async findAllDevices(userId: string): Promise<sessionViewModel[]>{    //МОЖЕТ не надо это здесь так как у нас запрос в квери репозиорий - сделать напрямую?
    return await sessionsQwRepository.findSessionsWithUserId(userId);
    
    },

    async deleteDevices( userId: string, refreshToken: string ): Promise<boolean>{

     const payload = await jwtService.getPayloadByRefreshToken(refreshToken);
     if(!payload) return false;

     const deviceId = payload.deviceId;
      
    return  await sessionsRepository.deleteDevices(userId, deviceId);
    }, 
    
     async deleteDevicesWithDeviceId( userId: string, deviceIdWithParams: string, ): Promise<Result<boolean>>{

     const session = await sessionsRepository.findSession( deviceIdWithParams ); //она точно есть так как есть проверка в мидлваре - до хендлера
 
     if(!session){ return {  
       status: ResultStatus.NotFound,
       errorMessage: 'Session not found',
       extensions: [{ field: 'Session' , message: 'Session not found' }],
       data: false,
     }}

     if( session.userId !== userId){ return {  
       status: ResultStatus.Forbidden,
       errorMessage: 'Wrong refresh token',
       extensions: [{ field: 'Session' , message: 'DeviceId of other user' }],
       data: false,
     }}

    const result = await sessionsRepository.deleteDeviceWithDevicedId(userId, deviceIdWithParams);
    
    return {  
       status: ResultStatus.Success,
       extensions: [],
       data: true,
     }
    } 
}