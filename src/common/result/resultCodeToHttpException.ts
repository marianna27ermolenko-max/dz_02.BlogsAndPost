import { ResultStatus } from "./resultCode";
import { HttpStatus } from "../types/http.status"; 

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BAD_REQUEST;
    case ResultStatus.Forbidden:
      return HttpStatus.FORBIDDEN;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};