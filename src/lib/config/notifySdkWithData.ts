/* eslint-disable eqeqeq */
/**
 * Notify the respective platform what the gateway event has occurred
 * @param {object} payload What data to provide on which platform
 * @param {{native: string, web: string}} handler What respective handle to call
 */

import { IHandler } from "src/Components/interfaces/server.interface";



export default function notifySdkWithData(
  platform: string,
  payload: any,
  handler: IHandler
) {
  // eslint-disable-next-line
  // @ts-ignore
  if (platform == "android" && AndroidInterface?.[handler?.native]) {
    // eslint-disable-next-line
    // @ts-ignore
    AndroidInterface?.[handler?.native](JSON.stringify(payload));
  } else if (
    platform == "ios" &&
    // eslint-disable-next-line
    // @ts-ignore
    webkit?.messageHandlers?.[handler?.native]
  ) {
    // eslint-disable-next-line
    // @ts-ignore
    webkit?.messageHandlers?.[handler?.native]?.postMessage(
      JSON.stringify(payload)
    );
  }
  (window?.parent === window ? window?.opener : window?.parent)?.postMessage(
    {
      action: handler.web,
      payload: payload,
    },
    "*"
  );
}
