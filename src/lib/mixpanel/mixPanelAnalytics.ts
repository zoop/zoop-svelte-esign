
import { AnalyticsEventKey } from "../../enum";
import { trackEvent } from "./mixpanel-utils";


/**
 * Metadata for analytics events.
 */
interface EventMeta {
  eventName: string;
  props: {
    product: string;
    screen_name: string;
    module: string;
    element: string;
    action: string;
  };
}

/**
 * Map event keys to their metadata.
 */
const events: Record<AnalyticsEventKey, EventMeta> = {
  [AnalyticsEventKey.CONSENT_LOADED]: {
    eventName: AnalyticsEventKey.CONSENT_LOADED,
    props: {
      product: "eSign",
      screen_name: "consent",
      module: "consent",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.CONSENT_VERIFY_CHECKBOX_CLICKED]: {
    eventName: AnalyticsEventKey.CONSENT_VERIFY_CHECKBOX_CLICKED,
    props: {
      product: "eSign",
      screen_name: "consent",
      module: "consent",
      element: "tnc_checkbox",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.CONSENT_TNC_CHECKBOX_CLICKED]: {
    eventName: AnalyticsEventKey.CONSENT_TNC_CHECKBOX_CLICKED,
    props: {
      product: "eSign",
      screen_name: "consent",
      module: "consent",
      element: "tnc_checkbox",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.CONSENT_PROCEED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.CONSENT_PROCEED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "proceed",
      module: "cta",
      element: "cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.AUTH_SEND_OTP_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.AUTH_SEND_OTP_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "auth",
      module: "auth",
      element: "send_otp",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.AUTH_VERIFY_OTP_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.AUTH_VERIFY_OTP_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "auth",
      module: "auth",
      element: "verify_otp",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PASSWORD_VERIFY_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.PASSWORD_VERIFY_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "password",
      module: "password",
      element: "verify",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.FACE_CAPTURE_LOADED]: {
    eventName: AnalyticsEventKey.FACE_CAPTURE_LOADED,
    props: {
      product: "eSign",
      screen_name: "face_capture",
      module: "face_capture",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.FACE_CAPTURE_CAMERA_FEED_LOADED]: {
    eventName: AnalyticsEventKey.FACE_CAPTURE_CAMERA_FEED_LOADED,
    props: {
      product: "eSign",
      screen_name: "face_capture",
      module: "camera",
      element: "feed",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.FACE_CAPTURE_PROCEED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.FACE_CAPTURE_PROCEED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "face_capture",
      module: "proceed",
      element: "cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.FACE_CAPTURE_CAMERA_PHOTO_CAPTURED]: {
    eventName: AnalyticsEventKey.FACE_CAPTURE_CAMERA_PHOTO_CAPTURED,
    props: {
      product: "eSign",
      screen_name: "face_capture",
      module: "camera",
      element: "photo",
      action: "captured",
    },
  },
  [AnalyticsEventKey.DOCUMENT_PREVIEW_LOADED]: {
    eventName: AnalyticsEventKey.DOCUMENT_PREVIEW_LOADED,
    props: {
      product: "eSign",
      screen_name: "document_preview",
      module: "document",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.DOCUMENT_PREVIEW_PROCEED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.DOCUMENT_PREVIEW_PROCEED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "document_preview",
      module: "proceed",
      element: "cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.DOCUMENT_PREVIEW_PAGE_RELOADED]: {
    eventName: AnalyticsEventKey.DOCUMENT_PREVIEW_PAGE_RELOADED,
    props: {
      product: "eSign",
      screen_name: "document_preview",
      module: "browser",
      element: "page",
      action: "reloaded",
    },
  },
  [AnalyticsEventKey.DOCUMENT_PREVIEW_CAPTURE_CAMERA_PHOTO_CAPTURED]: {
    eventName: AnalyticsEventKey.DOCUMENT_PREVIEW_CAPTURE_CAMERA_PHOTO_CAPTURED,
    props: {
      product: "eSign",
      screen_name: "document_preview",
      module: "camera",
      element: "photo",
      action: "captured",
    },
  },
  [AnalyticsEventKey.AUTHENTICATION_SCREEN_LOADED]: {
    eventName: AnalyticsEventKey.AUTHENTICATION_SCREEN_LOADED,
    props: {
      product: "eSign",
      screen_name: "authentication",
      module: "authentication",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.SIGNATURE_CARD_LOADED]: {
    eventName: AnalyticsEventKey.SIGNATURE_CARD_LOADED,
    props: {
      product: "eSign",
      screen_name: "signature_card",
      module: "signature",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.SIGNATURE_INSERT_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.SIGNATURE_INSERT_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "document_preview",
      module: "signature",
      element: "insert",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.ESIGN_RESULT_LOADED]: {
    eventName: AnalyticsEventKey.ESIGN_RESULT_LOADED,
    props: {
      product: "eSign",
      screen_name: "esign_result",
      module: "result",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.ESIGN_RESULT_STATUS_SUCCESS]: {
    eventName: AnalyticsEventKey.ESIGN_RESULT_STATUS_SUCCESS,
    props: {
      product: "eSign",
      screen_name: "esign_result",
      module: "result",
      element: "status",
      action: "success",
    },
  },
  [AnalyticsEventKey.ESIGN_RESULT_STATUS_FAILURE]: {
    eventName: AnalyticsEventKey.ESIGN_RESULT_STATUS_FAILURE,
    props: {
      product: "eSign",
      screen_name: "esign_result",
      module: "result",
      element: "status",
      action: "failure",
    },
  },
  [AnalyticsEventKey.ESIGN_RESULT_DOWNLOAD_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.ESIGN_RESULT_DOWNLOAD_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "esign_result",
      module: "document",
      element: "download_cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.BULK_ESIGN_RESULT_DOWNLOAD_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.BULK_ESIGN_RESULT_DOWNLOAD_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "bulk_esign_result",
      module: "document",
      element: "download_cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.APPROVER_APPROVED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.APPROVER_APPROVED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "approver_flow",
      module: "decision",
      element: "approve_cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.APPROVER_DECLINED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.APPROVER_DECLINED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "approver_flow",
      module: "decision",
      element: "decline_cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_SCREEN_LOADED]: {
    eventName: AnalyticsEventKey.PREFERENCE_SCREEN_LOADED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "preference",
      element: "screen",
      action: "loaded",
    },
  },
  [AnalyticsEventKey.PREFERENCE_SIGN_TYPE_DIGITAL_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_SIGN_TYPE_DIGITAL_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "sign_type",
      element: "digital",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_SIGN_TYPE_AADHAAR_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_SIGN_TYPE_AADHAAR_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "sign_type",
      element: "aadhaar",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_PROCEED_CTA_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_PROCEED_CTA_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "proceed",
      element: "cta",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_EMAIL_OTP_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_EMAIL_OTP_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "email_otp",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_WHATSAPP_OTP_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_WHATSAPP_OTP_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "whatsapp_otp",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_OTP_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_OTP_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "otp",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_BIOMETRIC_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_BIOMETRIC_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "biometric",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_IRIS_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_IRIS_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "iris",
      action: "clicked",
    },
  },
  [AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_FACE_CLICKED]: {
    eventName: AnalyticsEventKey.PREFERENCE_AUTH_DIGITAL_FACE_CLICKED,
    props: {
      product: "eSign",
      screen_name: "preference",
      module: "auth",
      element: "face",
      action: "clicked",
    },
  },
};

export type EventKey = keyof typeof events;
export function trackAnalyticsEvent(key: EventKey) {
  const { eventName, props } = events[key];
  void trackEvent(eventName, props);
}
