import { Request, Response, NextFunction } from "express" 
import { HttpStatus } from "../../common/types/http.status";
import { jwtService } from "../adapters/jwt.service";
import { usersQwRepository } from "../../users/infrastructure/user.query.repository";

export const jwtTokenGuardMiddleware = 
    async (req: Request , 
    res: Response, 
    next: NextFunction) => {

        const auth = req.headers['authorization'] as string;

        if(!auth){
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }

        const [authType, token] = auth.split(' ');
        if(authType !== 'Bearer' || !token){
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return
        }

        const userId = await jwtService.getUserIdByToken(token);

         if(!userId){
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
    
        }
          
        const user = await usersQwRepository.findUserById(userId);

        if(!user){
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
    
        }
         
            req.userId = user.id;
            next();
    }