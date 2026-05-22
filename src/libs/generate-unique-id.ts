const ID_LENGTH = 32;
const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateUniqueId = (): string => {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => CHARSET[byte % CHARSET.length]).join("");
};
