import { AUTH_PATH } from "../../src/common/paths/path";
import { HttpStatus } from "../../src/common/types/http.status";
import { CreateUserDto } from "../../src/users/types/create.user.dto";
import { testSeederUserDTO } from "../seeder/test.seeder";
import request from "supertest";
import { Express } from "express";

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
  cookies: string[];
}

    export const fullCreateUserWithToken = async (app: Express, dto: CreateUserDto): Promise<UserTokens> => {

        const user = await testSeederUserDTO.insertUser(dto);

        await request(app)
          .post(`${AUTH_PATH}/registration-confirmation`)
          .send({ code: user.emailConfirmation.confirmationCode })
          .expect(HttpStatus.NO_CONTENT);

        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: dto.login,
            password: dto.password,
          })
          .expect(HttpStatus.OK);

        const accessToken = res.body.accessToken;  

        const cookies = res.headers["set-cookie"];
        if (!Array.isArray(cookies)) {
          throw new Error("No cookies");
        }
        
        const refreshCookie = cookies.find((c) => c.includes("refreshToken"));
        const refreshToken = refreshCookie?.split(";")[0].split("=")[1];

        return {accessToken, refreshToken, cookies};
    }