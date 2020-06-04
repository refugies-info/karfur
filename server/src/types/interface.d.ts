export interface RequestFromClient {
  body: {
    query: Record<string, any> | Object;
    sort: Record<string, any>;
    populate?: string;
  };
  fromSite: boolean;
}

export interface Res {
  status: Function;
}
