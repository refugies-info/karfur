import { Body, Controller, Post, Route } from "tsoa";
import { TechnicalInfoRequest } from "api-types";
import { verifyVersion } from "src/workflows";
import { AuthenticationError } from "../errors";
import { Response } from "src/types/interface";

@Route("")
export class MiscController extends Controller {
  @Post("/technical-info")
  public async technicalInfo(@Body() req: TechnicalInfoRequest): Response {
    return verifyVersion(req.appVersion).then((result) =>
      result ? { text: "success" } : Promise.reject(new AuthenticationError("Please upgrade your application")),
    );
  }
}
