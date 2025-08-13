import { callApi } from "../callApi";

export function fetchBrandingInfo({ requestId }: { requestId: string }) {
  return callApi("get", "/fetch/branding-info", { request_id: requestId });
}
