import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_HEX = process.env.ENCRYPTION_KEY;

if (!KEY_HEX) {
  throw new Error('FATAL: ENCRYPTION_KEY is not defined. Must be a 32-byte hex string.');
}

const KEY = Buffer.from(KEY_HEX, 'hex');

if (KEY.length !== 32) {
  throw new Error('FATAL: ENCRYPTION_KEY must be 32 bytes (64 hex characters).');
}

export function encrypt(text: string): string {
  try {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (e) {
    console.error('Encryption failed:', e);
    throw new Error('Encryption failed');
  }
}

export function decrypt(text: string): string {
  if (!text) return text;
  
  const parts = text.split(':');
  // If not in our format (iv:tag:content), return as is (legacy/plaintext)
  if (parts.length !== 3) {
    return text;
  }
  
  const [ivHex, authTagHex, encryptedHex] = parts;
  
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.error('Decryption failed:', e);
    // If decryption fails (e.g. wrong key or corrupted), return original text or throw?
    // Returning original text might leak encrypted blob to UI which is ugly but safe.
    // Throwing might crash the page.
    // Let's return the original text so the user sees "something is wrong" but app doesn't crash.
    return text; 
  }
}

export function encryptBuffer(buffer: Uint8Array): Buffer {
  try {
    const buf = Buffer.from(buffer);
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buf), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Format: IV (12) + AuthTag (16) + EncryptedData
    return Buffer.concat([iv, authTag, encrypted]);
  } catch (e) {
    console.error('Buffer encryption failed:', e);
    throw new Error('Buffer encryption failed');
  }
}

export function decryptBuffer(buffer: Uint8Array): Buffer {
  const buf = Buffer.from(buffer);
  // Check minimum length (IV + Tag = 28 bytes)
  if (buf.length < 28) {
    return buf; // Too short to be encrypted by us
  }

  try {
    const iv = buf.subarray(0, 12);
    const authTag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);
    
    const decipher = createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  } catch (e) {
    console.error('Buffer decryption failed:', e);
    return buf; // Return original if fail
  }
}
