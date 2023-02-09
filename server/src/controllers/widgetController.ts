import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Route,
  Path,
  Security
} from "tsoa";

/* TODO: update workflows */
import { getWidgets, GetWidgetResponse } from "../workflows/Widgets/getWidgets";
import { postWidgets, PostWidgetResponse } from "../workflows/Widgets/postWidgets";
import { patchWidget, PatchWidgetResponse } from "../workflows/Widgets/patchWidget";
import { deleteWidget } from "../workflows/Widgets/deleteWidget";
import { Response, ResponseWithData } from "../types/interface";

export interface WidgetRequest {
  name: string;
  themes: { _id: string }[];
  typeContenu: ("dispositif" | "demarche")[];
  languages?: string[];
  department?: string;
}

@Route("widgets")
export class WidgetController extends Controller {

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Get("/")
  public async get(): ResponseWithData<GetWidgetResponse[]> {
    return getWidgets();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("/")
  public async post(
    @Body() body: WidgetRequest
  ): ResponseWithData<PostWidgetResponse> {
    return postWidgets(body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<WidgetRequest>
  ): ResponseWithData<PatchWidgetResponse> {
    return patchWidget(id, body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Delete("{id}")
  public async delete(
    @Path() id: string
  ): Response {
    return deleteWidget(id);
  }
}
