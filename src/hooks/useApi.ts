import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
  useQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  MutationKey,
} from "react-query";
import "react-native-get-random-values"; // Needed before uuid import according to their docs
import { v4 as uuidv4 } from "uuid";

import { apiCaller } from "../utils/ConfigAPI";
import { logger } from "../logger";

type Method = "GET" | "POST" | "PUT" | "DELETE";
export type ResponseWith<T> = { data: T };

const UID_STORAGE_KEY = "uid";

export const getUid = async (): Promise<string> => {
  const uid = await AsyncStorage.getItem("uid");
  if (uid) {
    return uid;
  }
  const newUid = uuidv4();
  await AsyncStorage.setItem(UID_STORAGE_KEY, newUid);
  return newUid;
};

export const makeApiRequest = async <Request extends any, T extends any>(
  url: string,
  payload: Request,
  method: Method = "GET"
): Promise<T> => {
  try {
    let headers = {};

    const uid = await getUid();
    if (uid) {
      headers = {
        "x-app-uid": uid,
      };
    }

    let resp = null;

    if (method === "GET") {
      resp = await apiCaller.get(url, { headers, params: payload });
    } else if (method === "POST") {
      resp = await apiCaller.post(url, payload, { headers });
    } else if (method === "PUT") {
      resp = await apiCaller.put(url, payload, { headers });
    } else if (method === "DELETE") {
      resp = await apiCaller.delete(url, payload, { headers });
    }

    return resp?.data || <T>null;
  } catch (err) {
    logger.error(`makeApiRequest error: ${err}`, { url, method });
    throw err;
  }
};

export const useApi = <Type, Error>(
  url: string,
  method: Method,
  key: string | any[],
  payload?: any,
  options?: UseQueryOptions<Type, Error, Type, QueryKey>
): UseQueryResult<Type, Error> => {
  return useQuery<Type, Error, Type>(
    key,
    () =>
      makeApiRequest<any, any>(url, payload, method).then(
        (response) => response.data
      ),
    options as Omit<
      UseQueryOptions<Type, Error, Type, QueryKey>,
      "queryKey" | "queryFn"
    >
  );
};

export const useApiMutation = <Type, Error>(
  url: string,
  method: Method,
  key: string | any[],
  options?: UseMutationOptions<Type, Error, Type, MutationKey>
): UseMutationResult<Type, Error, Type> => {
  return useMutation<Type, Error, Type>(
    key,
    (payload: any) => makeApiRequest<any, any>(url, payload, method),
    options as Omit<
      UseMutationOptions<Type, Error, Type>,
      "mutationKey" | "mutationFn"
    >
  );
};
