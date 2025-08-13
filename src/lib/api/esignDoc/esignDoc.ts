// src/services/api.ts
import { callApi } from "../callApi";

export const esignDoc = async (requestId: string, signatureImage: string) => {
  try {
    const resp: any = await callApi("put", `/sign`, {
      requestId,
      image: signatureImage
    });

    if (!resp?.success) {
      return {
        status: "error",
        data: resp
      };
    }

    return {
      status: "success",
      data: resp
    };
  } catch (err: any) {
    return {
      status: "error",
      data: { error: err.message ?? err }
    };
  }
};
