import { ObjectId, WithId } from "mongodb";
import { usersRepository } from "../../users/infrastructure/user.repository";
import { bcryptService } from "../adapters/bcrypt.service";
import { IUserAuthMe } from "../../users/types/user.auth.me.output";
import { usersQwRepository } from "../../users/infrastructure/user.query.repository";
import { IUserView } from "../../users/types/user.view.interface";
import { usersService } from "../../users/domain/users.service";
import { nodemailerServise } from "../adapters/nodemailer.server";
import { UserAccountDbType } from "../types/user.account.db.type";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { CreateUserDto } from "../../users/types/create.user.dto";

export const authServer = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<UserAccountDbType> | null> {
    //Promise<{ accessToken: string } | null> - было

    const isCorrectCredentials = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );

    if (!isCorrectCredentials) return null; //Ошибка входа
    return isCorrectCredentials; //возвращаемое значение при успешной авторизации и сейчас я возвращаю ЮЗЕРА, а до этого возвращала заглушку
  },

  //проверяем правельные ли логин и пароль, использовали в создании юзера через админку
  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<WithId<UserAccountDbType> | null> {

    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const correctPassword = await bcryptService.checkPassword(
      password,
      user.accountData.passwordHash,
    );

    return correctPassword ? user : null;
  },

  async getUserByUserId(userId: string): Promise<IUserAuthMe | null> {
    const user = await usersQwRepository.findUserByUserId(userId);
    if (!user) return null;

    return user;
  },

  async registrationUser(dto: CreateUserDto): Promise<string | null> {
    const { login, email, password } = dto;

    const user = await usersRepository.doesExistByLoginOrEmail(login, email);

    console.log(user);
    
    if (user) return null;

    const passwordHash = await bcryptService.generationHash(password);

    console.log(passwordHash);
    
    const newUser: UserAccountDbType = {
      accountData: {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };

   console.log(newUser);

    const resultCreateUser = await usersRepository.createUser(newUser);

     console.log(resultCreateUser);

    try {
      const sendEmail = await nodemailerServise.sendEmail(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode!
      );
       console.log(sendEmail)
    } catch (e: unknown) {

      console.error("Ошибка отправки email:", e);
      await usersRepository.deleteUser(resultCreateUser);
      return null;
    }

    return resultCreateUser;
  },

  async confirmEmail(code: string): Promise<boolean>{
    const user = await usersRepository.findUserByConfirmationCode(code);
    if(!user) return false;
    if(user.emailConfirmation.isConfirmed) return false;
    if(user.emailConfirmation.expirationDate! < new Date()) return false;

    const updateConfirm = await usersRepository.updateIsConfirmed(user.accountData.email);
    return updateConfirm; 
  }
};


