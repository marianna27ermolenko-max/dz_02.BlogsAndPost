import { RequestWithBody } from "../../../common/types/requests";
import { Response } from "express";
import { LoginDto } from "../../types/login.dto";
import { authServer } from "../../domain/auth.service";`~~`
import { HttpStatus } from "../../../common/types/http.status";
import { APIErrorResult } from "../../../common/utils/APIErrorResult";
import { jwtService } from "../../adapters/jwt.service";


export async function createAuthUserHandler(
  req: RequestWithBody<LoginDto>,
  res: Response,
) {
  try {

    const { loginOrEmail, password } = req.body;
    console.log(loginOrEmail, password);
    

    const correntUser = await authServer.loginUser(loginOrEmail, password);
     console.log(correntUser);

    if (!correntUser)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          APIErrorResult([
            {
              message: "If the password or login is wrong",
              field: "loginOrEmail",
            },
          ]),
        );
    
    const accessToken = await jwtService.createToken(correntUser); //перенести в сервер

    res.status(HttpStatus.OK).json({accessToken});
  } catch (err: unknown) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
