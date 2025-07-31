// src/lib/api/callApi.ts
import { axiosInstance } from "./axiosInstance";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export async function callApi<T = any>(
  method: HttpMethod,
  url: string,
  params?: any,
  options: Record<string, any> = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && params instanceof FormData;

  const finalHeaders = options.headers || {};
  try {
    const response = await axiosInstance.request<T>({
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
