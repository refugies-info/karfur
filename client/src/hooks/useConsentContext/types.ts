enum BaseConsents {
  ALL = "all",
  MANDATORY = "mandatory",
}

enum MyConsents {
  GOOGLE_ANALYTICS = "google_analytics",
  FACEBOOK_PIXEL = "facebook_pixel",
  YOUTUBE = "youtube",
}

export enum Consents {
  ALL = "all",
  MANDATORY = "mandatory",
  GOOGLE_ANALYTICS = "google_analytics",
  FACEBOOK_PIXEL = "facebook_pixel",
  YOUTUBE = "youtube",
}

export type ConsentsType<T> = {
  [key: string]: boolean;
};

export type MyConsentsType = ConsentsType<Consents>;
