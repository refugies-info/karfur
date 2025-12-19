import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values"; // Needed before uuid import according to their docs
import {
  type MutationKey,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
} from "react-query";
import { v4 as uuidv4 } from "uuid";

import { logger } from "~/logger";
import { apiCaller } from "~/utils/ConfigAPI";

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

export const makeApiRequest = async <Request, T>(
  url: string,
  payload: Request,
  method: Method = "GET",
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
      resp = await apiCaller.delete(url, { headers, params: payload });
    }

    return resp?.data || <T>null;
  } catch (err) {
    logger.error(`makeApiRequest error: ${err}`, { url, method });
    throw err;
  }
};

export const useApi = <Type, Error, Key extends QueryKey = QueryKey>(
  url: string,
  method: Method,
  key: Key,
  payload?: unknown,
  options?: UseQueryOptions<Type, Error, Type, Key>,
): UseQueryResult<Type, Error> => {
  return useQuery<Type, Error, Type, Key>(
    key,
    () =>
      makeApiRequest<unknown, { data: Type }>(url, payload, method).then(
        (response) => response.data,
      ),
    options as Omit<UseQueryOptions<Type, Error, Type, Key>, "queryKey" | "queryFn">,
  );
};

export const useApiMutation = <
  Type,
  Error,
  Payload = unknown,
  Key extends MutationKey = MutationKey,
>(
  url: string,
  method: Method,
  key: Key,
  options?: UseMutationOptions<Type, Error, Payload, Key>,
): UseMutationResult<Type, Error, Payload> => {
  return useMutation<Type, Error, Payload, Key>(
    key,
    (payload: Payload) =>
      makeApiRequest<Payload, { data: Type }>(url, payload, method).then(
        (response) => response.data,
      ),
    options as Omit<UseMutationOptions<Type, Error, Payload, Key>, "mutationKey" | "mutationFn">,
  );
};
