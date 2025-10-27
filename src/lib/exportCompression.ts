import { EU, Subject, Grade } from '@/types/grade';

// Mapping for property name compression
const KEY_MAP = {
  // EU keys
  id: 'i',
  name: 'n',
  coefficient: 'c',
  color: 'o',
  subjects: 's',
  grades: 'g',

  // Grade keys
  value: 'v',
  type: 't',
  min: 'm',
  max: 'x',
  isConfirmed: 'f',

  // Value type
  exact: 'e',
  range: 'r'
};

const REVERSE_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

function compressObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(compressObject);
  }

  if (typeof obj === 'object') {
    const compressed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const shortKey = KEY_MAP[key as keyof typeof KEY_MAP] || key;
      compressed[shortKey] = compressObject(value);
    }
    return compressed;
  }

  return obj;
}

function decompressObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(decompressObject);
  }

  if (typeof obj === 'object') {
    const decompressed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const longKey = REVERSE_KEY_MAP[key] || key;
      decompressed[longKey] = decompressObject(value);
    }
    return decompressed;
  }

  return obj;
}

export function exportData(eus: EU[]): string {
  // Compress object keys
  const compressed = compressObject(eus);

  // Convert to JSON
  const jsonString = JSON.stringify(compressed);

  // Encode to base64
  const encoded = btoa(unescape(encodeURIComponent(jsonString)));

  return encoded;
}

export function importData(code: string): EU[] {
  // Decode from base64
  const decoded = decodeURIComponent(escape(atob(code.trim())));

  // Parse JSON
  const compressed = JSON.parse(decoded);

  // Decompress object keys
  const decompressed = decompressObject(compressed);

  return decompressed as EU[];
}
