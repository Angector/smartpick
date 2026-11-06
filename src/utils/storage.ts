/**
 * دسترسی ایمن به localStorage.
 *
 * قواعد:
 *  - هرگز throw نمی‌کند (اگر localStorage مسدود باشد یا پر شود).
 *  - کلیدها نسخه‌دار هستند تا مهاجرت آینده بدون تخریب داده ممکن باشد.
 *  - JSON خراب → fallback، بدون کرش.
 */

const STORAGE_VERSION = "v1";

/**
 * کلیدهای نسخه‌دار.
 * الگو: `smartpick:v1:<feature>`
 */
export const STORAGE_KEYS = {
  favorites: `smartpick:${STORAGE_VERSION}:favorites`,
  compare: `smartpick:${STORAGE_VERSION}:compare`,
  preferences: `smartpick:${STORAGE_VERSION}:preferences`,
} as const;

/** خواندن ایمن از localStorage با مقدار پیش‌فرض. */
export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** نوشتن ایمن در localStorage. در صورت خطا بی‌صدا رد می‌شود. */
export function safeSetItem(key: string, value: unknown): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // فضای storage پر است یا دسترسی مسدود — رد می‌شویم.
  }
}

/** حذف ایمن یک کلید. */
export function safeRemoveItem(key: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // رد می‌شویم.
  }
}