/**
 * @url POST /options/{key}
 */
export interface AdminOptionRequest {
  value: unknown;
}

/**
 * @url GET /options/{key}
 */
export interface GetAdminOptionResponse {
  key: string;
  value: unknown;
}

/**
 * @url POST /options/{key}
 */
export interface PostAdminOptionResponse {
  key: string;
  value: unknown;
}
