/**
 * ساخت مسیر مطلق/نسبی برای فایل‌های عمومی (فونت، تصویر، ...).
 *
 * چرا لازم است؟
 *  - در dev، BASE_URL معمولاً "/" است.
 *  - در build با base: "./" مقدار BASE_URL برابر "./" می‌شود
 *    و فایل‌های public از ریشه‌ی dist سرو می‌شوند.
 *  - در GitHub Pages با base: "/<repo>/" مقدار BASE_URL همان زیرمسیر است.
 *
 * این تابع تضمین می‌کند مسیر همیشه با BASE_URL ترکیب شود و
 * روی هر سه سناریو کار کند.
 */
export function getAssetPath(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL;

  if (cleanPath === "") {
    return base;
  }

  return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

/**
 * میان‌بر برای تصاویر گوشی‌ها.
 * فایل‌ها در public/images/phones/ قرار می‌گیرند.
 * ورودی: نام فایل (مثلاً "samsung-s24.webp").
 * اگر null بدهی، null برمی‌گرداند تا PhoneImage به placeholder بیفتد.
 */
export function getPhoneImagePath(
  fileName: string | null | undefined,
): string | null {
  if (!fileName) return null;
  return getAssetPath(`images/phones/${fileName}`);
}