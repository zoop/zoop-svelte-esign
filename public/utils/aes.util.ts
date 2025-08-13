
import CryptoJS from "crypto-js";
import { aesSecretKeys } from "../../src/config/aadhaar-esp.config";

export function encryptUsingAes(number: string): string {
  const key = CryptoJS.enc.Utf8.parse(aesSecretKeys.server);
  const encrypted = CryptoJS.AES.encrypt(number, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedBase64 = encrypted.toString(); // Same as Java's Base64
  const wordArray = CryptoJS.enc.Utf8.parse(encryptedBase64);
  const doubleEncoded = CryptoJS.enc.Base64.stringify(wordArray);
  return doubleEncoded;
}

export function decryptUsingAes(text: string): string {
  try {
    const key = CryptoJS.enc.Utf8.parse(aesSecretKeys.client);
    const decodedWordArray = CryptoJS.enc.Base64.parse(text);
    const recoveredEncryptedBase64 =
      CryptoJS.enc.Utf8.stringify(decodedWordArray);
    const decrypted = CryptoJS.AES.decrypt(recoveredEncryptedBase64, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error("Error while decryption:", error);
    return "0000";
  }
}
