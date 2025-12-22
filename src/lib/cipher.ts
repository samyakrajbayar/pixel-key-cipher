// BMP Image Cipher - Client-side implementation using Web Crypto API
// Implements PBKDF2 key derivation + AES-GCM authenticated encryption

/**
 * Read BMP file as ArrayBuffer
 */
export async function readBmpBytes(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * SHA-256 hash of BMP data → 32-byte fingerprint
 */
export async function getBmpFingerprint(bmpBytes: ArrayBuffer): Promise<ArrayBuffer> {
  return await crypto.subtle.digest("SHA-256", bmpBytes);
}

/**
 * Convert ArrayBuffer to hex string for display
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Derive AES-256 key from password + BMP fingerprint using PBKDF2
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  bmpFingerprint: ArrayBuffer
): Promise<CryptoKey> {
  // Import password as key material
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Combine salt with BMP fingerprint
  const combinedSalt = new Uint8Array(salt.length + new Uint8Array(bmpFingerprint).length);
  combinedSalt.set(salt);
  combinedSalt.set(new Uint8Array(bmpFingerprint), salt.length);

  // Derive AES key using PBKDF2
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: combinedSalt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export interface EncryptionResult {
  ciphertext: string;
  stats: {
    bmpSize: number;
    fingerprintPreview: string;
    saltPreview: string;
    noncePreview: string;
    ciphertextSize: number;
  };
}

/**
 * Encrypt message using BMP image + password
 */
export async function encryptMessage(
  bmpFile: File,
  password: string,
  message: string
): Promise<EncryptionResult> {
  // Step 1: Read BMP file
  const bmpBytes = await readBmpBytes(bmpFile);

  // Step 2: Get BMP fingerprint
  const fingerprint = await getBmpFingerprint(bmpBytes);

  // Step 3: Generate random salt (16 bytes)
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Step 4: Derive key
  const key = await deriveKey(password, salt, fingerprint);

  // Step 5: Generate random nonce/IV (12 bytes for AES-GCM)
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // Step 6: Encrypt message
  const messageBytes = new TextEncoder().encode(message);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    messageBytes
  );

  // Step 7: Combine salt + nonce + ciphertext
  const fullBlob = new Uint8Array(
    salt.length + nonce.length + new Uint8Array(ciphertext).length
  );
  fullBlob.set(salt);
  fullBlob.set(nonce, salt.length);
  fullBlob.set(new Uint8Array(ciphertext), salt.length + nonce.length);

  // Step 8: Base64 encode
  const base64 = btoa(String.fromCharCode(...fullBlob));

  return {
    ciphertext: base64,
    stats: {
      bmpSize: bmpBytes.byteLength,
      fingerprintPreview: arrayBufferToHex(fingerprint).slice(0, 16) + "...",
      saltPreview: arrayBufferToHex(salt.buffer).slice(0, 8) + "...",
      noncePreview: arrayBufferToHex(nonce.buffer).slice(0, 8) + "...",
      ciphertextSize: fullBlob.length,
    },
  };
}

export interface DecryptionResult {
  success: boolean;
  message?: string;
  error?: string;
  stats?: {
    bmpSize: number;
    fingerprintPreview: string;
  };
}

/**
 * Decrypt ciphertext using BMP image + password
 */
export async function decryptMessage(
  bmpFile: File,
  password: string,
  encodedCiphertext: string
): Promise<DecryptionResult> {
  try {
    // Step 1: Read BMP file
    const bmpBytes = await readBmpBytes(bmpFile);

    // Step 2: Get BMP fingerprint
    const fingerprint = await getBmpFingerprint(bmpBytes);

    // Step 3: Base64 decode
    const fullBlob = Uint8Array.from(atob(encodedCiphertext), (c) =>
      c.charCodeAt(0)
    );

    // Step 4: Extract components
    const salt = fullBlob.slice(0, 16);
    const nonce = fullBlob.slice(16, 28);
    const ciphertext = fullBlob.slice(28);

    // Step 5: Derive key
    const key = await deriveKey(password, salt, fingerprint);

    // Step 6: Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      ciphertext
    );

    // Step 7: Decode message
    const message = new TextDecoder().decode(decrypted);

    return {
      success: true,
      message,
      stats: {
        bmpSize: bmpBytes.byteLength,
        fingerprintPreview: arrayBufferToHex(fingerprint).slice(0, 16) + "...",
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? "Decryption failed: Wrong password, wrong image, or tampered data"
          : "Unknown error occurred",
    };
  }
}
