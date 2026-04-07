import { Request, Response } from "express";
import { HttpStatus } from "../../../common/types/http.status";
import { authService } from "../../domain/auth.service";
import { ResultStatus } from "../../../common/result/resultCode";

export async function logoutHandler(req: Request, res: Response){

try {

    const refreshToken = req.cookies.refreshToken;

    console.log('Logout token:', refreshToken);
    
    const blacklistResult = await authService.insertIntoBlackListRefreshToken(refreshToken); 
     
    if(blacklistResult.status === ResultStatus.Success) 
        return res.sendStatus(HttpStatus.NO_CONTENT)

    return res.sendStatus(HttpStatus.UNAUTHORIZED);

    } catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }

}