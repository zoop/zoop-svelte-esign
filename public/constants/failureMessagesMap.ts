interface IFailureMessage {
  imagePath: string;
  message: string;
  description: string;
}

export const failureMessageMap: Record<string, IFailureMessage> = {
  "Transaction has expired": {
    imagePath: "/images/txn-expired.svg",
    message: "Transaction Expired",
    description: "Reach out to owner for more information",
  },
  "Bulk Esign Transaction has expired": {
    imagePath: "/images/txn-expired.svg",
    message: "Transaction Expired",
    description: "Reach out to owner for more information",
  },
  "Transaction has been suspended": {
    imagePath: "/images/txn-expired.svg",
    message: "Transaction Suspended",
    description: "Reach out to owner for more information",
  },
  "Transaction completed. Please create new transaction.": {
    imagePath: "/images/txn-completed.svg",
    message: "Transaction Completed",
    description: "Your current transaction has already been completed. ",
  },
  "Internal Error": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description: "Due to an Internal error, your transaction has failed",
  },
  "Unknown Error": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description: "Due to an Unknown error, your transaction has failed",
  },
  "Maximum No of Otp Send Attempts has been exceeded": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description:
      "Transaction blocked due to malicious activity.please contact owner",
  },
  "Maximum No of Otp Verify Attempts has been exceeded": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description:
      "Transaction blocked due to malicious activity.please contact owner",
  },
  "Session Expired. Please refresh and verify password again": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description: "Transaction blocked since session has been expired",
  },
  "Transaction has been blocked": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Unsuccessful",
    description:
      "Transaction blocked due to malicious activity.please contact owner",
  },
  "Transaction has been cancelled": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Cancelled",
    description: "Transaction has been cancelled by the owner",
  },
  "Transaction ID is invalid": {
    imagePath: "/images/txn-invalid.svg",
    message: "Transaction Invalid",
    description: "Your Transaction ID is invalid",
  },
  "Transaction is paused. Wait for other signers to finish": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction Paused",
    description: "This Document is currently being signed by other signers",
  },
  "Transaction is paused. Wait for estamp addition": {
    imagePath: "/images/loader.gif",
    message: "Please wait...",
    description: "Your document is getting generated",
  },
  "Transaction is paused. Wait for template generation": {
    imagePath: "/images/loader.gif",
    message: "Please wait...",
    description: "Your document is getting generated",
  },
  "Transaction is paused. Wait for document generation": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction Paused",
    description: "This Document is currently being generated",
  },
  "Signing in progress": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction Paused",
    description: "This Document is currently being signed by other signers",
  },
  "Transaction is in progress": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction is in progress",
    description: "This Document is currently being signed",
  },
  "Bulk Esigning in progress": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction is in progress",
    description: "The Documents are currently being signed",
  },
  "Transaction not found": {
    imagePath: "/images/txn-not-found.svg",
    message: "Transaction Not Found",
    description: "Oops! Your current transaction was not found",
  },
  "Bulk Esign transaction not found": {
    imagePath: "/images/txn-not-found.svg",
    message: "Transaction Not Found",
    description: "Oops! Your current transaction was not found",
  },
  "Error while loading PDF": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Transaction Error",
    description: "Error while loading pdf",
  },
  "Transaction requires approval from an authorized approver before proceeding.":
  {
    imagePath: "/images/txn-invalid.svg",
    message: "Approval Pending",
    description:
      "This transaction will be available for signing once it is approved.",
  },
  "Transaction is rejected.": {
    imagePath: "/images/txn-not-found.svg",
    message: "Transaction Rejected",
    description: "This transaction has been rejected.",
  },
  "Transaction is in a drafted state.": {
    imagePath: "/images/txn-not-found.svg",
    message: "Transaction Drafted",
    description:
      "You cannot sign this document at the moment. Please contact the sender to finalize the transaction before signing.",
  },
  "Transaction has to be automatically signed.": {
    imagePath: "/images/txn-paused.svg",
    message: "Transaction is in AUTO DSC Mode",
    description: "Wait a moment...your document is getting generated",
  },
  "Unexpected error": {
    imagePath: "/images/txn-unsuccess.svg",
    message: "Internal Error",
    description:
      " Sorry for the inconvenience, we are currently experiencing server issues",
  },
};