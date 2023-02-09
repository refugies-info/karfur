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
import { getNeeds, Need as GetNeed } from "../workflows/Needs/getNeeds";
import { postNeeds, Need as PostNeed } from "../workflows/Needs/postNeeds";
import { patchNeed, Need as PatchNeed } from "../workflows/Needs/patchNeed";
import { deleteNeed } from "../workflows/Needs/deleteNeed";
import { addView } from "../workflows/Needs/addView";
import { updatePositions } from "../workflows/Needs/updatePositions";
import { Picture, Response, ResponseWithData } from "../types/interface";

export interface NeedParams {
  fr: {
    text: string;
    subtitle: string;
  },
  theme: string;
  image?: Picture;
  adminComments: string;
}

@Route("needs")
export class NeedController extends Controller {

  @Get("/")
  public async get(): ResponseWithData<GetNeed[]> {
    return getNeeds();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("/")
  public async post(
    @Body() body: NeedParams
  ): ResponseWithData<PostNeed> {
    return postNeeds(body);
  }

  @Security({
    fromSite: [],
    jwt: ["expert"]
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<NeedParams>
  ): ResponseWithData<PatchNeed> {
    return patchNeed(id, body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Delete("{id}")
  public async delete(
    @Path() id: string
  ): Response {
    return deleteNeed(id);
  }

  @Post("views")
  public async views(
    @Body() id: string
  ): Response {
    return addView(id);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("positions")
  public async positions(
    @Body() orderedNeedIds: string[]
  ): ResponseWithData<GetNeed[]> {
    return updatePositions(orderedNeedIds);
  }
}
