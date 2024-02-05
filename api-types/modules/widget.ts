import { ContentType, Id } from "../generics";

/**
 * @url POST /widgets, PATCH /widgets/{id}
 */
export interface WidgetRequest {
  name: string;
  themes: Id[];
  typeContenu: ContentType[];
  languages?: string[];
  department?: string;
}

/**
 * @url GET /widgets
 */
export interface GetWidgetResponse {
  _id: Id;
  name: string;
  tags: string[];
  themes: Id[];
  typeContenu: ContentType[];
  department: string;
  languages: string[];
  author: { username?: string, email: string };
  created_at: Date;
}

/**
 * @url POST /widgets
 */
export interface PostWidgetResponse {
  _id: Id;
  name: string;
  tags: string[];
  themes: Id[];
  typeContenu: ContentType[];
  department: string;
  languages: string[];
  author: { username?: string, email: string };
  created_at: Date;
}

/**
 * @url PATCH /widgets/{id}
 */
export interface PatchWidgetResponse {
  _id: Id;
  name: string;
  tags: string[];
  themes: Id[];
  typeContenu: ContentType[];
  department: string;
  languages: string[];
  author: { username?: string, email: string };
  created_at: Date;
}
