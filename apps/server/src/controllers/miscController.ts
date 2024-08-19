import { TechnicalInfoRequest } from "@refugies-info/api-types";
import { Body, Controller, Get, Post, Route } from "tsoa";
import { AuthenticationError } from "../errors";
import { Response } from "../types/interface";
import { verifyVersion } from "../workflows";

@Route("")
export class MiscController extends Controller {
  @Post("/technical-info")
  public async technicalInfo(@Body() req: TechnicalInfoRequest): Response {
    return verifyVersion(req.appVersion).then((result) =>
      result ? { text: "success" } : Promise.reject(new AuthenticationError("Please upgrade your application")),
    );
  }

  @Get("/health")
  public async health(): Response {
    return { text: "success" };
  }
}
