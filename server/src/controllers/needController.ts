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
import { getNeeds, GetNeedResponse } from "../workflows/Needs/getNeeds";
import { postNeeds, PostNeedResponse } from "../workflows/Needs/postNeeds";
import { patchNeed, PatchNeedResponse } from "../workflows/Needs/patchNeed";
import { deleteNeed } from "../workflows/Needs/deleteNeed";
import { addView } from "../workflows/Needs/addView";
import { updatePositions } from "../workflows/Needs/updatePositions";
import { Picture, Response, ResponseWithData } from "../types/interface";

export interface NeedRequest {
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
  public async get(): ResponseWithData<GetNeedResponse[]> {
    return getNeeds();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("/")
  public async post(
    @Body() body: NeedRequest
  ): ResponseWithData<PostNeedResponse> {
    return postNeeds(body);
  }

  @Security({
    fromSite: [],
    jwt: ["expert"]
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<NeedRequest>
  ): ResponseWithData<PatchNeedResponse> {
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
  ): ResponseWithData<GetNeedResponse[]> {
    return updatePositions(orderedNeedIds);
  }
}
