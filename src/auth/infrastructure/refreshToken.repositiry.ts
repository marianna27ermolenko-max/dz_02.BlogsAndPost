import { refreshTokenCollection } from "../../db/mongo.db";


export const refreshTokenRepository = { //УДАЛИТЬ ПРИ СЕССИЯХ БОЛЬШЕ НЕ ПРИМИНЯЕМ 

  async insertIntoBlackList(token: string): Promise<string>{

    const result = await refreshTokenCollection.insertOne({refreshToken: token});
    return result.insertedId.toString();
  },

  
  async findRefreshTokenBlackList(token: string): Promise<boolean> {
    
    const result = await refreshTokenCollection.findOne({ refreshToken: token });
    return !!result
  },
};
