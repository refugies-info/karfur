export interface RequestFromClient {
  body: {
    query: Record<string, any> | Object;
    sort: Record<string, any>;
    populate?: string;
  };
  fromSite: boolean;
  query?: { id?: string };
}

export interface Res {
  status: Function;
}
