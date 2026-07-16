const SENSITIVE_KEYS = new Set([
  'password',
  'authorization',
  'token',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'apikey',
  'api_key',
  'signature',
  'secret',
]);

const MAX_STRING_LENGTH = 300;

/**
 * Deep-clones a request/response payload for console logging: masks
 * sensitive fields (passwords, tokens, API keys, signatures) by key name and
 * truncates long strings (e.g. base64 document uploads) so a single request
 * can't flood the console or leak secrets into logs.
 *
 * @param value - Payload to prepare for logging (request body, response data, etc.).
 * @param depth - Internal recursion guard against deeply nested/cyclical payloads.
 */
export function redactForLogging(value: unknown, depth = 0): unknown {
  if (depth > 6 || value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}...(${value.length} chars total)`
      : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactForLogging(item, depth + 1));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEYS.has(key.toLowerCase())
          ? '[REDACTED]'
          : redactForLogging(val, depth + 1),
      ]),
    );
  }

  return value;
}
