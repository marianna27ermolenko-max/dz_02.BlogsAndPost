import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import express from "express";
import { SETTINGS } from "../../../src/common/settings/setting";
import { client, runDB } from "../../../src/db/mongo.db";
import {
  AUTH_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "../../../src/common/paths/path";
import { HttpStatus } from "../../../src/common/types/http.status";
import {
  createUser,
  registrationUser,
} from "../../../test-utils/users/createUser.helper";
import { testSeederUserDTO } from "../../../test-utils/seeder/test.seeder";
import { fullCreateUserWithToken } from "../../../test-utils/auth/fullCreateUserWithTokens.helper";
import { usersRepository } from "../../../src/users/infrastructure/user.repository";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from "../../../src/auth/guard/super-admin.guard-middleware";


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

  const InvalidDtoUser = {
    login: "",
    password: "",
    email: "wrong email",
  };

  const validDtoCreateUser = {
    login: "admin_7",
    password: "Passw0rd!",
    email: "admin.test@mail.ru",
  };

  describe("POST /login", () => {
    describe("validation", () => {
      it("should not try login user to the system through invalid login: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: InvalidDtoUser.login,
            password: InvalidDtoUser.password,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not try login user to the system through invalid email: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: InvalidDtoUser.email,
            password: InvalidDtoUser.password,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });
    });

    describe("success (200)", () => {
      it("should try registration user to the system through login and get AccsesToken: STATUS 200", async () => {
        await createUser(app, validDtoCreateUser);

        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: validDtoCreateUser.login,
            password: validDtoCreateUser.password,
          })
          .expect(HttpStatus.OK);

        expect(res.body).toHaveProperty("accessToken");
        expect(typeof res.body.accessToken).toBe("string");

        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();

        if (!Array.isArray(cookies)) {
          throw new Error("set-cookie is not an array");
        }
        expect(cookies.some((cookie) => cookie.includes("refreshToken"))).toBe(
          true,
        );
      });

      it("should try login user to the system through email and get AccsesToken: STATUS 200", async () => {
        await createUser(app, validDtoCreateUser);

        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: validDtoCreateUser.email,
            password: validDtoCreateUser.password,
          })
          .expect(HttpStatus.OK);

        expect(res.body).toHaveProperty("accessToken");
        expect(typeof res.body.accessToken).toBe("string");
      });
    });

    describe("authentication (401)", () => {
      it("should not login with non-existing email: STATUS 401", async () => {
        await createUser(app, validDtoCreateUser);

        await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: "wrong@mail.com",
            password: validDtoCreateUser.password,
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not login with non-existing login: STATUS 401", async () => {
        await createUser(app, validDtoCreateUser);

        await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: "wrongLogin",
            password: validDtoCreateUser.password,
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not login with wrong password: STATUS 401", async () => {
        await createUser(app, validDtoCreateUser);

        await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: validDtoCreateUser.login,
            password: "wrong password",
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not login without email confirm: STATUS 401", async () => {
        await testSeederUserDTO.insertUser(validDtoCreateUser);

        const res = await request(app)
          .post(`${AUTH_PATH}/login`)
          .send({
            loginOrEmail: validDtoCreateUser.login,
            password: validDtoCreateUser.password,
          })
          .expect(HttpStatus.UNAUTHORIZED);

        expect(res.body.errorsMessages?.[0].message).toBe("Email not confirm");
      });
    });
  });

  describe("POST /registration", () => {
    describe("validation", () => {
      it("should not try login user to the system through invalid login: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration`)
          .send({
            login: InvalidDtoUser.login,
            password: validDtoCreateUser.password,
            email: validDtoCreateUser.email,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not try login user to the system through invalid email: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration`)
          .send({
            login: validDtoCreateUser.login,
            password: validDtoCreateUser.password,
            email: InvalidDtoUser.email,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not try login user to the system through invalid password: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration`)
          .send({
            login: validDtoCreateUser.login,
            password: InvalidDtoUser.password,
            email: validDtoCreateUser.email,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });
    });

    it("should register user with correct data: STATUS 204", async () => {
      await registrationUser(app, validDtoCreateUser);
    });

    it("should not register user twice: STATUS 400", async () => {
      await registrationUser(app, validDtoCreateUser);

      const res = await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send(validDtoCreateUser)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toHaveProperty("errorsMessages");
    });
  });

  describe("POST /registration-confirmation", () => {
    it("validation", async () => {
      const res = await request(app)
        .post(`${AUTH_PATH}/registration-confirmation`)
        .send({ code: "" })
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body).toHaveProperty("errorsMessages");
    });

    describe("STATUS 400", () => {
      it("should not account activated with expired code", async () => {
        const time = new Date(Date.now() - 1000);
        const user = await testSeederUserDTO.insertUser({
          login: "admin_7",
          password: "Passw0rd!",
          email: "admin.test@mail.ru",
          expirationDate: time,
        });

        const res = await request(app)
          .post(`${AUTH_PATH}/registration-confirmation`)
          .send({ code: user.emailConfirmation.confirmationCode })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not account activated with already active email", async () => {
        const user = await testSeederUserDTO.insertUser({
          login: "admin_7",
          password: "Passw0rd!",
          email: "admin.test@mail.ru",
          isConfirmed: true,
        });

        const res = await request(app)
          .post(`${AUTH_PATH}/registration-confirmation`)
          .send({ code: user.emailConfirmation.confirmationCode })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not activate account if user does not exist", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration-confirmation`)
          .send({ code: "gdhfjikd2518shsks98v" })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });
    });

    describe("STATUS 204", () => {
      it("should account activated with valid code and email", async () => {
        const user = await testSeederUserDTO.insertUser(validDtoCreateUser);

        await request(app)
          .post(`${AUTH_PATH}/registration-confirmation`)
          .send({ code: user.emailConfirmation.confirmationCode })
          .expect(HttpStatus.NO_CONTENT);
      });
    });
  });

  describe("POST /registration-email-resending", () => {
    describe("STATUS 400", () => {
      it("should not active user with not valid email: STATUS 400", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration-email-resending`)
          .send({ email: "" })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not activate account if user does not exist", async () => {
        const res = await request(app)
          .post(`${AUTH_PATH}/registration-email-resending`)
          .send({ email: "hello@mail.ruu" })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });

      it("should not account activated with already active email", async () => {
        const user = await testSeederUserDTO.insertUser({
          login: "admin_7",
          password: "Passw0rd!",
          email: "admin.test@mail.ru",
          isConfirmed: true,
        });

        const res = await request(app)
          .post(`${AUTH_PATH}/registration-email-resending`)
          .send({ email: user.accountData.email })
          .expect(HttpStatus.BAD_REQUEST);

        expect(res.body).toHaveProperty("errorsMessages");
      });
    });
    describe("STATUS 204", () => {
      it("STATUS 204", async () => {
        await registrationUser(app, validDtoCreateUser);

        await request(app)
          .post(`${AUTH_PATH}/registration-email-resending`)
          .send({ email: validDtoCreateUser.email })
          .expect(HttpStatus.NO_CONTENT);
      });
    });
  });

  describe("POST /refresh-token", () => {
    describe("STATUS 200", () => {
      it("should update tokens with active refreshToken", async () => {
        const { refreshToken } = await fullCreateUserWithToken(
          app,
          validDtoCreateUser,
        );

        const result = await request(app)
          .post(`${AUTH_PATH}/refresh-token`)
          .set("Cookie", [`refreshToken=${refreshToken}`])
          .expect(HttpStatus.OK);

        expect(result.body).toHaveProperty("accessToken");
        expect(typeof result.body.accessToken).toBe("string");

        const newCookies = result.headers["set-cookie"];
        expect(newCookies).toBeDefined();
        if (!Array.isArray(newCookies)) {
          throw new Error("set-cookie is not an array");
        }
        expect(
          newCookies.some((cookie) => cookie.includes("refreshToken")),
        ).toBe(true);
      });
    });

  describe("STATUS 401", () => {
    it("should not update tokens if refreshToken not be in cookies", async () => {
      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set("Cookie", [])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should not update tokens if refreshToken be in thi Black list", async () => {
      const { refreshToken } = await fullCreateUserWithToken(
        app,
        validDtoCreateUser,
      );

      const fistResult = await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .expect(HttpStatus.OK);

      expect(fistResult.body).toHaveProperty("accessToken");

      const secondResult = await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .expect(HttpStatus.UNAUTHORIZED);

      expect(secondResult.body).toHaveProperty("errorMessages");
    });

    it("should not update tokens if user not exist", async () => {
      const { refreshToken } = await fullCreateUserWithToken(
        app,
        validDtoCreateUser,
      );
      const user = await usersRepository.findByEmail(validDtoCreateUser.email);

      await request(app)
        .delete(`${USERS_PATH}/${user?._id}`)
        .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
        .expect(HttpStatus.NO_CONTENT);

      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should not update tokens if refresh token is expired", async () => {
      const { refreshToken } = await fullCreateUserWithToken(
        app,
        validDtoCreateUser,
      );
      await new Promise((res) => setTimeout(res, 21000));

      await request(app)
        .post(`${AUTH_PATH}/refresh-token`)
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .expect(HttpStatus.UNAUTHORIZED);
    }, 30000);
  });
  });

  describe("POST /logout", () => {
    describe("STATUS 204", () => {
      it("should will be revoked with correct refresh token", async () => {
        const { refreshToken } = await fullCreateUserWithToken(
          app,
          validDtoCreateUser,
        );

        await request(app)
          .post(`${AUTH_PATH}/logout`)
          .set("Cookie", [`refreshToken=${refreshToken}`])
          .expect(HttpStatus.NO_CONTENT);

        await request(app)
          .post(`${AUTH_PATH}/refresh-token`)
          .set("Cookie", [`refreshToken=${refreshToken}`])
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe("STATUS 401", () => {
      it("should not revoked if have not refresh token", async () => {
        await request(app)
          .post(`${AUTH_PATH}/logout`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not revoke with invalid refresh token", async () => {
        await request(app)
          .post(`${AUTH_PATH}/refresh-token`)
          .set("Cookie", [`refreshToken=invalid_token`])
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe("GET /me", () => {
    describe("STATUS 200", () => {
      it("should get information about current user", async () => {
        const { accessToken } = await fullCreateUserWithToken( app, validDtoCreateUser );

        const result = await request(app)
          .get(`${AUTH_PATH}/me`)
          .set("authorization", `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);

        expect(result.body.email).toBe(validDtoCreateUser.email);
        expect(result.body.login).toBe(validDtoCreateUser.login);
        expect(result.body.userId).toBeDefined();
      });
    });

    describe("STATUS 401", () => {
      it("should return 401 if access token is missing", async () => {
        await request(app)
          .get(`${AUTH_PATH}/me`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should return 401 if access token is invalid", async () => {
        await request(app)
          .get(`${AUTH_PATH}/me`)
          .set("authorization", `Bearer invalid_token`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not get information if user not exist", async () => {
        const { accessToken } = await fullCreateUserWithToken( app, validDtoCreateUser );
        const user = await usersRepository.findByEmail( validDtoCreateUser.email );

        await request(app)
          .delete(`${USERS_PATH}/${user?._id}`)
          .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
          .expect(HttpStatus.NO_CONTENT);

        await request(app)
          .get(`${AUTH_PATH}/me`)
          .set("authorization", `Bearer ${accessToken}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it("should not get information if access token expired", async () => {
        const { accessToken } = await fullCreateUserWithToken( app, validDtoCreateUser );

        await new Promise((res) => setTimeout(res, 11000)); // ждем истечения времени жизни токена

        await request(app)
          .get(`${AUTH_PATH}/me`)
          .set("authorization", `Bearer ${accessToken}`)
          .expect(HttpStatus.UNAUTHORIZED);
      }, 
      20000);
    });
  });
});
