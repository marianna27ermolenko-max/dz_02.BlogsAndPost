import request from "supertest";
import { setupApp } from "../../src/setup-app";
import express from "express";
import { client, runDB } from "../../src/db/mongo.db";
import { TESTING_PATH } from "../../src/common/paths/path";
import { HttpStatus } from "../../src/common/types/http.status";
import { SETTINGS } from "../../src/common/settings/setting";
import { nodemailerServise } from "../../src/auth/adapters/nodemailer.server";
import { testSeederUserDTO } from "../../test-utils/seeder/test.seeder"; 
import { authService } from "../../src/auth/domain/auth.service";
import { ResultStatus } from "../../src/common/result/resultCode";
import { usersRepository } from "../../src/users/infrastructure/user.repository";

describe("AUTH_TEST", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
  });

  beforeEach(async () => {
    await request(app)
      .delete(`${TESTING_PATH}/all-data`)
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await client.close();
  });

  //заглушка - перезаписываем функцию в объекте на время прохождения теста, после теста память очищается и возвращается к ориг функции
  nodemailerServise.sendEmail = jest
    .fn()
    .mockImplementation((email: string, code: string, subject: string) =>
      Promise.resolve(true),
    );

  describe("User registration", () => {
    it("should register user with correct data", async () => {
      const { login, email, password } = testSeederUserDTO.createUserDto();

      const result = await authService.registrationUser({
        login,
        email,
        password,
      });

      expect(result.status).toBe(ResultStatus.Success);
      expect(nodemailerServise.sendEmail).toHaveBeenCalled();
      expect(nodemailerServise.sendEmail).toHaveBeenCalledTimes(1);
    });

    it("should not register user twice", async () => {
      const { login, email, password } = testSeederUserDTO.createUserDto();
      await testSeederUserDTO.insertUser({ login, email, password });

      const result = await authService.registrationUser({
        login,
        email,
        password,
      });

      expect(result.status).toBe(ResultStatus.BadRequest);
    });
  });

  describe("Confirm email", () => {
    it("should not confirm email if user does not exist", async () => {
      const result = await authService.confirmEmail("pam-param");

      expect(result.status).toBe(ResultStatus.BadRequest);
    });

   it("should not confirm email which is confirmed", async () => {
      const { login, email, password } = testSeederUserDTO.createUserDto();
      const user = await testSeederUserDTO.insertUser({ login, email, password, isConfirmed: true  });
      
      const result = await authService.confirmEmail(user.emailConfirmation.confirmationCode!);
      
      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions?.[0].field).toBe('code')
    });

     it("should not confirm email with expired code", async () => {
      const { login, email, password } = testSeederUserDTO.createUserDto();
      const user = await testSeederUserDTO.insertUser({ login, email, password, expirationDate: new Date(Date.now() - 1000)});
      
      const result = await authService.confirmEmail(user.emailConfirmation.confirmationCode!);
      
      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions?.[0].field).toBe('code')
    });

    it('confirm user', async () => {
      const { login, email, password } = testSeederUserDTO.createUserDto();
      const user = await testSeederUserDTO.insertUser({ login, email, password});

      const result = await authService.confirmEmail(user.emailConfirmation.confirmationCode!);
      expect(result.status).toBe(ResultStatus.Success);

      const userUpdateIsConfirm = await usersRepository.findById(user.id);
      expect(userUpdateIsConfirm?.emailConfirmation.isConfirmed).toBeTruthy();
    });
  });

});
