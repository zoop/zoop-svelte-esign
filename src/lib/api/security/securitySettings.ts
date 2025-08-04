// src/lib/api/security.ts
import { callApi } from "../callApi";

export function fetchSecuritySettings({ requestId }: { requestId: string }) {
	return callApi("get", `/fetch/security-settings`, { request_id: requestId });
}
