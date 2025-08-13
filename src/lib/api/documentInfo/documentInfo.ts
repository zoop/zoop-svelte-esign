// src/lib/api/document.ts
import { callApi } from "../callApi";
import { axiosV4 } from "../axiosInstance";

export function fetchDocumentInfo({ requestId }: { requestId: string }) {
  return callApi("get", `/doc-info/${requestId}`, undefined, { axiosInstance: axiosV4 });
}
