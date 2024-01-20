import axios, { AxiosRequestConfig } from "axios";

import { constants } from "misc";

export const fetchData = async <T>({
  url,
  authorization,
  data,
  method,
  isAuthorizationRequired = true,
  params,
}: {
  url: string;
  authorization?: string;
  data?: any;
  method: AxiosRequestConfig["method"];
  isAuthorizationRequired?: boolean;
  params?: any;
}) => {
  const auth = authorization ?? constants.AUTH;
  if (!auth && isAuthorizationRequired) return;
  const requestConfig: AxiosRequestConfig = {
    method: method,
    baseURL: constants.BASE_URL,
    url: url,
    headers: auth
      ? {
          Authorization: auth,
        }
      : undefined,
    params: params,
  };
  if (data) {
    requestConfig["data"] = data;
    requestConfig["headers"] = {
      ...requestConfig.headers,
      "Content-Type": "application/json",
    };
  }
  return await axios.request<T>(requestConfig);
};

export async function api<T>(apiCall: {
  url: string;
  authorization?: string;
  params?: any;
  isAuthorizationRequired?: boolean;
}) {
  try {
    const response = await fetchData<T>({ ...apiCall, method: "get" });
    return response?.data;
  } catch (error) {
    console.error(error);
  }
}

export namespace api {
  export const get = api;
  export const post = async <T>(apiCall: {
    url: string;
    authorization?: string;
    data?: any;
    isAuthorizationRequired?: boolean;
  }) => {
    try {
      return await fetchData<T>({ ...apiCall, method: "post" });
    } catch (error) {
      console.error(error);
    }
  };
}
