interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * A single-value in-memory cache with a time-to-live. Instantiate one per cache key
 * (e.g. as a private field on a repository) to avoid re-fetching from an upstream
 * system (Salesforce, etc.) on every call.
 *
 * Lives only for the lifetime of the process holding the instance - lost on restart,
 * and not shared across multiple instances of the app.
 */
export class TtlCache<T> {
  private entry: CacheEntry<T> | null = null;

  constructor(private readonly ttlMs: number) {}

  /**
   * @returns The cached value if present and not yet expired, otherwise `undefined`.
   */
  get(): T | undefined {
    if (this.entry && Date.now() < this.entry.expiresAt) {
      return this.entry.value;
    }
    return undefined;
  }

  /**
   * Stores a value, resetting the expiry to `ttlMs` from now.
   *
   * @param value - Value to cache.
   */
  set(value: T): void {
    this.entry = { value, expiresAt: Date.now() + this.ttlMs };
  }

  /**
   * Clears the cached value, forcing the next `get()` to miss.
   */
  clear(): void {
    this.entry = null;
  }
}
