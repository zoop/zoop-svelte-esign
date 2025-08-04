// src/lib/api/callApi.ts
import type { AxiosInstance } from "axios";
import { axiosV5 } from "./axiosInstance";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export async function callApi<T = any>(
  method: HttpMethod,
  url: string,
  params?: any,
  options: {
    axiosInstance?: AxiosInstance;
    headers?: Record<string, any>;
    [key: string]: any;
  } = {}
): Promise<T> {
  const instance = options.axiosInstance || axiosV5;
  const finalHeaders = options.headers || {};

  try {
    const response = await instance.request<T>({
      method,
      url,
      headers: finalHeaders,
      ...(method === "get" ? { params } : { data: params }),
      ...options,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
