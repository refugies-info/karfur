/**
 * @url POST /sms/download-app
 */
export interface DownloadAppRequest {
  phone: string;
  locale: string;
}

/**
 * @url POST /sms/content-link
 */
export interface ContentLinkRequest {
  phone: string;
  title: string;
  url: string;
  locale: string;
}
