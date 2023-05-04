/**
 * @url POST /options/{key}
 */
export interface AdminOptionRequest {
  value: any;
}

/**
 * @url GET /options/{key}
 */
export interface GetAdminOptionResponse {
  key: string;
  value: any;
}

/**
 * @url POST /options/{key}
 */
export interface PostAdminOptionResponse {
  key: string;
  value: any;
}
