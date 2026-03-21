import jwt  from "jsonwebtoken";
import { SETTINGS } from "../../common/settings/setting";
import { WithId } from "mongodb";
import { UserAccountDbType } from "../types/user.account.db.type";


export const jwtService = {
                                                              // string - токен возвращается в строке , но может опр есть шаблон - посмотреть 
    async createToken(user: WithId<UserAccountDbType>): Promise<string>{ //передать юзер-айди не юзер
        
        const token = jwt.sign({userId: user._id}, SETTINGS.JWT_SECRET, {expiresIn: '24h'});
        return token;
    },   
    /* мы создадим токен - нам нужны полез.нагрузки и хедерс(или хедерс вот так по умолчанию оставим) - 
    (отдельно или сразу взять) и секретный ключ */
 

    async getUserIdByToken(token: string): Promise<string | null >{      //а здесь когда нам прилеьтьь токен от клиента мы расштфруем токен - полезную нагрузку и из нее возьмем айди - так как сами написали это в пэйлоад
                                                                           //Promise<ObjectId | null >
        try{
        const accessToken: any = jwt.verify(token, SETTINGS.JWT_SECRET); //вернет нам полез.нашрузку или ошибку - ее словим в хендлере через кач?
        return accessToken.userId;   //new ObjectId(accessToken.userId);

        }catch(e){
        return null;
        }
    }  


}

