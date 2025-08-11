export enum UserRole {
  APPROVER = "APPROVER",
  SIGNER = "SIGNER",
  OWNER = "OWNER",
}

export enum SecurityStep {
  EMAIL_AUTHENTICATION = "EMAIL_AUTHENTICATION",
  PASSWORD_PROTECTION = "PASSWORD_PROTECTION",
  PHOTO_AND_LOCATION = "PHOTO_AND_LOCATION",
}

export enum ESP {
  NSDL = "NSDL",
  VSIGN = "VSIGN",
  CDSL = "CDSL",
  EMUDHRA = "EMUDHRA",
  ZOOP = "ZOOP",
  UNKNOWN = "UNKNOWN",
}

export enum AuthType {
  SMS = "SMS",
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
}

export enum EsignType {
  AADHAAR = "AADHAAR",
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
  VIRTUAL = "VIRTUAL",
  SMS = "SMS",
  MISC = "MISC",
  AUTO_DSC = "AUTO_DSC",
}

export enum EsignOption {
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
  AADHAAR = "AADHAAR",
}

export enum AnalyticsEventKey {
  CONSENT_LOADED = "consent_loaded",
  CONSENT_VERIFY_CHECKBOX_CLICKED = "consent_verify_checkbox_clicked",
  CONSENT_TNC_CHECKBOX_CLICKED = "consent_tnc_checkbox_clicked",
  CONSENT_PROCEED_CTA_CLICKED = "consent_proceed_cta_clicked",
  AUTH_SEND_OTP_CTA_CLICKED = "auth_send_otp_cta_clicked",
  AUTH_VERIFY_OTP_CTA_CLICKED = "auth_verify_otp_cta_clicked",
  PASSWORD_VERIFY_CTA_CLICKED = "password_verify_cta_clicked",
  FACE_CAPTURE_LOADED = "face_capture_loaded",
  FACE_CAPTURE_CAMERA_FEED_LOADED = "face_capture_camera_feed_loaded",
  FACE_CAPTURE_PROCEED_CTA_CLICKED = "face_capture_proceed_cta_clicked",
  FACE_CAPTURE_CAMERA_PHOTO_CAPTURED = "face_capture_camera_photo_captured",
  AUTHENTICATION_SCREEN_LOADED = "authentication_screen_loaded",
  SIGNATURE_CARD_LOADED = "signature_card_loaded",
  DOCUMENT_PREVIEW_LOADED = "document_preview_loaded",
  DOCUMENT_PREVIEW_PROCEED_CTA_CLICKED = "document_preview_proceed_cta_clicked",
  DOCUMENT_PREVIEW_PAGE_RELOADED = "document_preview_page_reloaded",
  DOCUMENT_PREVIEW_CAPTURE_CAMERA_PHOTO_CAPTURED = "document_preview_capture_camera_photo_captured",
  SIGNATURE_INSERT_CTA_CLICKED = "signature_insert_cta_clicked",
  ESIGN_RESULT_LOADED = "esign_result_loaded",
  ESIGN_RESULT_STATUS_SUCCESS = "esign_result_status_success",
  ESIGN_RESULT_STATUS_FAILURE = "esign_result_status_failure",
  ESIGN_RESULT_DOWNLOAD_CTA_CLICKED = "esign_result_download_cta_clicked",
  BULK_ESIGN_RESULT_DOWNLOAD_CTA_CLICKED = "bulk_esign_result_download_cta_clicked",
  APPROVER_APPROVED_CTA_CLICKED = "approver_approved_cta_clicked",
  APPROVER_DECLINED_CTA_CLICKED = "approver_declined_cta_clicked",
  PREFERENCE_SCREEN_LOADED = "preference_screen_loaded",
  PREFERENCE_SIGN_TYPE_DIGITAL_CLICKED = "preference_sign_type_digital_clicked",
  PREFERENCE_SIGN_TYPE_AADHAAR_CLICKED = "preference_sign_type_aadhaar_clicked",
  PREFERENCE_PROCEED_CTA_CLICKED = "preference_proceed_cta_clicked",
  PREFERENCE_AUTH_DIGITAL_EMAIL_OTP_CLICKED = "preference_auth_digital_email_otp_clicked",
  PREFERENCE_AUTH_DIGITAL_WHATSAPP_OTP_CLICKED = "preference_auth_digital_whatsapp_otp_clicked",
  PREFERENCE_AUTH_DIGITAL_OTP_CLICKED = "preference_auth_digital_otp_clicked",
  PREFERENCE_AUTH_DIGITAL_BIOMETRIC_CLICKED = "preference_auth_digital_biometric_clicked",
  PREFERENCE_AUTH_DIGITAL_IRIS_CLICKED = "preference_auth_digital_iris_clicked",
  PREFERENCE_AUTH_DIGITAL_FACE_CLICKED = "preference_auth_digital_face_clicked",
}

export enum AuthMode {
  OTP = "OTP",
  FMR = "FMR", //Finger Image Record
  IIR = "IIR", //Iris Image Record
  FIA = "FIA", // Face Image Authentication
}