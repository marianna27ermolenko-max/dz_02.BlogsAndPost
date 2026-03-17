import { WithId } from "mongodb";
import { usersRepository } from "../../users/infrastructure/user.repository";
import { IUserBD } from "../../users/types/user.db.interface";
import { bcryptService } from "../adapters/bcrypt.service";
import { IUserAuthMe } from "../../users/types/user.auth.me.output";
import { usersQwRepository } from "../../users/infrastructure/user.query.repository";

export const authServer = {

  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<IUserBD> | null> { //Promise<{ accessToken: string } | null> - было

    const isCorrectCredentials = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );

    if (!isCorrectCredentials) return null;  //Ошибка входа
   
    return isCorrectCredentials; //возвращаемое значение при успешной авторизации и сейчас я возвращаю ЮЗЕРА, а до этого возвращала заглушку
  },


  //проверяем правельные ли логин и пароль
  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<IUserBD> | null> {    //Promise<boolean> - было

    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const correctPassword = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    return correctPassword ? user : null;
  },

  async getUserByUserId(userId: string): Promise<IUserAuthMe | null>{

    const user = await usersQwRepository.findUserByUserId(userId);

    if(!user) return null;

    return user;
  }
};





//ПРЕЖНИЙ КОД
// async loginUser(loginOrEmail: string, password: string): Promise<{ accessToken: string } | null>{  //Promise<{ accessToken: string } | null>

// const isCorrectCredentials = await this.checkUserCredentials(loginOrEmail, password);

//  if(!isCorrectCredentials) return null;   //Ошибка входа
//   return { accessToken: 'token' };       //возвращаемое значение при успешной авторизации или нам сейчас вернуть юзера ???
// },

//       //проверяем правельные ли логин и пароль
// async checkUserCredentials(loginOrEmail: string, password: string): Promise<boolean>{    //Promise<boolean> - было
//  const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

//  if(!user) return false;

// return bcryptService.checkPassword(password, user.passwordHash);
// },
