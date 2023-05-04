import { Types } from "mongoose";
import { Moment } from "moment";
import { Languages, NeedId, ThemeId, User } from "../typegoose";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { DocumentType } from "@typegoose/typegoose";

export type Modify<T, R> = Omit<T, keyof R> & R;

declare global {
  namespace Express {
    export interface Request {
      user?: DocumentType<User>;
      userId?: typeof User._id;
    }
  }
}

// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends object
  ? RecursivePartial<T[P]>
  : T[P];
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface Request extends ExpressRequest { }
// Exposed to avoid Request name conflict
export interface IRequest extends Request { }
export interface Res extends ExpressResponse { }
// export interface Response<CustomResponse = any> extends ExpressResponse<{ text?: string; data?: CustomResponse }> {}

type ResponseText = "success" | "error";
interface APIResponse {
  text: ResponseText;
  code?: string;
}
interface APIResponseWithData<Data> extends APIResponse {
  data: Data;
}

export type Response = Promise<APIResponse>;
export type ResponseWithData<Data> = Promise<APIResponseWithData<Data>>;

interface Config {
  secret?: string;
}

export interface RequestFromClient<Query> extends Request {
  body?: {
    query: Query;
    sort: Record<string, any>;
    populate?: string | any;
    locale?: Languages;
    limit?: number;
  };
  query?: Query;
}

export interface RequestFromClientWithBody<Query> extends Request {
  body: Query;
  query?: Query;
  params?: any;
}

export interface RequestFromClientWithFiles extends Request {
  files: any;
}

export interface NeedDetail {
  text: string;
  updatedAt: Moment;
}
/**
 * @deprecated
 */
export interface Need {
  fr: NeedDetail;
  ar?: NeedDetail;
  en?: NeedDetail;
  ti?: NeedDetail;
  ru?: NeedDetail;
  ps?: NeedDetail;
  fa?: NeedDetail;
  uk?: NeedDetail;
  _id: Types.ObjectId;
  created_at: Moment;
  updatedAt: Moment;
}

export interface AlgoliaObject {
  objectID: Types.ObjectId | string;
  title_fr: string;
  title_ru?: string;
  title_en?: string;
  title_fa?: string;
  title_ar?: string;
  title_ps?: string;
  title_uk?: string;
  title_ti?: string;
  name_fr?: string;
  name_ru?: string;
  name_en?: string;
  name_fa?: string;
  name_ar?: string;
  name_ps?: string;
  name_uk?: string;
  name_ti?: string;
  abstract_fr?: string;
  abstract_ar?: string;
  abstract_en?: string;
  abstract_fa?: string;
  abstract_ru?: string;
  abstract_ps?: string;
  abstract_uk?: string;
  abstract_ti?: string;
  sponsorName?: string;
  sponsorUrl?: string;
  nbVues?: number;
  theme?: ThemeId;
  secondaryThemes?: ThemeId[];
  needs?: NeedId[];
  typeContenu: "demarche" | "dispositif" | "besoin" | "theme";
  priority: number;
  webOnly: boolean;
}
