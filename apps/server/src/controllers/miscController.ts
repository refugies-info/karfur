import type { ReportClientErrorRequest, TechnicalInfoRequest } from "@refugies-info/api-types";
import { Body, Controller, Get, Post, Request, Route, Security } from "tsoa";
import { AuthenticationError } from "~/errors";
import type { IRequest, Response } from "~/types/interface";
import { reportClientError, verifyVersion } from "~/workflows";

@Route("")
export class MiscController extends Controller {
  @Post("/technical-info")
  public async technicalInfo(@Body() req: TechnicalInfoRequest): Response {
    return verifyVersion(req.appVersion).then((result) =>
      result
        ? { text: "success" }
        : Promise.reject(new AuthenticationError("Please upgrade your application")),
    );
  }

  /**
   * Authentifié : seules les personnes qui rédigent ou traduisent déclenchent ces erreurs, et
   * un endpoint ouvert serait un moyen simple d'inonder Slack.
   */
  @Post("/client-error")
  @Security("jwt")
  public async clientError(
    @Body() body: ReportClientErrorRequest,
    @Request() request: IRequest,
  ): Response {
    return reportClientError(body, request.user).then(() => ({ text: "success" }));
  }

  @Get("/health")
  public async health(): Response {
    return { text: "success" };
  }
}
