import { CreateUserDto } from "../types/create.user.dto";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { usersRepository } from "../infrastructure/user.repository";
import { UserAccountDbType } from "../../auth/types/user.account.db.type";

export const usersService = {
  async createUserThroughtAdmin(dto: CreateUserDto): Promise<string> {
    const { login, password, email } = dto;

    const existingLogin = await usersRepository.findByLogin(login);
    if (existingLogin) {
      throw { message: "Login already exists", field: "login" };
    }

    const existingEmail = await usersRepository.findByEmail(email);
    if (existingEmail) {
      throw { message: "Email already exists", field: "email" };
    }

    const passwordHash = await bcryptService.generationHash(password);

    const newUser: UserAccountDbType = {
      accountData: {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },

      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
    };

    const newUserId = await usersRepository.createUserAdmin(newUser);

    return newUserId;
  },

  async deleteUser(id: string): Promise<boolean> {
    const user = await usersRepository.findById(id);
    if (!user) return false;

    return await usersRepository.deleteUser(id);
  },
};
