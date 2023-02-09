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
import { getWidgets, Widget as GetWidget } from "../workflows/Widgets/getWidgets";
import { postWidgets, Widget as PostWidget } from "../workflows/Widgets/postWidgets";
import { patchWidget, Widget as PatchWidget } from "../workflows/Widgets/patchWidget";
import { deleteWidget } from "../workflows/Widgets/deleteWidget";
import { Response, ResponseWithData } from "../types/interface";

export interface WidgetParams {
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
  public async get(): ResponseWithData<GetWidget[]> {
    return getWidgets();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("/")
  public async post(
    @Body() body: WidgetParams
  ): ResponseWithData<PostWidget> {
    return postWidgets(body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<WidgetParams>
  ): ResponseWithData<PatchWidget> {
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
