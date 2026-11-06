import { useCallback, useEffect, useRef, useState } from "react";
import { safeGetItem, safeSetItem, safeRemoveItem } from "../utils/storage";

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

/**
 * هوک ذخیره‌سازی در localStorage با API شبیه useState.
 *
 * - مقدار اولیه از localStorage خوانده می‌شود (اگر نبود → initialValue).
 * - هر تغییر، خودکار در localStorage نوشته می‌شود.
 * - تابع سوم مقدار را به initialValue برمی‌گرداند و کلید را پاک می‌کند.
 * - همه‌ی عملیات‌ها از توابع ایمن `utils/storage.ts` عبور می‌کنند.
 *
 * نکته: initialValue فقط یک‌بار در mount خوانده می‌شود (via useState initializer).
 * برای initialValueهای جدید از `removeValue()` استفاده کن یا setValue بده.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    safeGetItem<T>(key, initialValue),
  );

  // نگه‌داشتن initialValue در ref تا در removeValue از نسخه‌ی اول استفاده شود.
  const initialRef = useRef(initialValue);

  // ذخیره‌ی خودکار در localStorage با هر تغییر
  useEffect(() => {
    safeSetItem(key, storedValue);
  }, [key, storedValue]);

  const setValue: SetValue<T> = useCallback((next) => {
    setStoredValue((prev) =>
      typeof next === "function" ? (next as (p: T) => T)(prev) : next,
    );
  }, []);

  const removeValue = useCallback(() => {
    setStoredValue(initialRef.current);
    safeRemoveItem(key);
  }, [key]);

  return [storedValue, setValue, removeValue];
}