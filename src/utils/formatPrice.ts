/**
 * ابزار قالب‌بندی قیمت به فارسی.
 *
 * چرا دستی؟ چون:
 *  - می‌خواهیم خروجی روی همه‌ی مرورگرها یکسان باشد (Intl در برخی نسخه‌های قدیمی باگ دارد).
 *  - ارقام فارسی + جداکننده‌ی هزارگان استاندارد فارسی (٬ — U+066C) می‌خواهیم.
 *  - تومان واحد پیش‌فرض است.
 */

const PERSIAN_DIGITS: readonly string[] = [
  "۰",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
];

/** جداکننده‌ی هزارگان استاندارد فارسی (Arabic thousands separator). */
const PERSIAN_THOUSANDS_SEP = "٬";

/** متن نمایش داده‌شده وقتی قیمت مشخص نیست. */
export const PRICE_UNAVAILABLE_FA = "قیمت مشخص نیست";

/**
 * تبدیل ارقام لاتین به فارسی.
 * فقط کاراکترهای 0-9 را تغییر می‌دهد؛ بقیه دست‌نخورده می‌مانند.
 */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => {
    const index = Number(digit);
    return PERSIAN_DIGITS[index] ?? digit;
  });
}

/**
 * قالب‌بندی قیمت کامل با جداکننده‌ی هزارگان.
 * قیمت نامعلوم (null/undefined/غیرعددی/منفی) → «قیمت مشخص نیست».
 *
 * مثال: 85000000 → "۸۵٬۰۰۰٬۰۰۰ تومان"
 */
export function formatPrice(toman: number | null | undefined): string {
  if (
    toman === null ||
    toman === undefined ||
    !Number.isFinite(toman) ||
    toman < 0
  ) {
    return PRICE_UNAVAILABLE_FA;
  }

  const grouped = Math.trunc(toman)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, PERSIAN_THOUSANDS_SEP);

  return `${toPersianDigits(grouped)} تومان`;
}

/**
 * قالب‌بندی فشرده برای جاهای کم‌جا (کارت، نشان، جدول).
 * مثال:
 *   85000000 → "۸۵ میلیون تومان"
 *   2500000000 → "۲٫۵ میلیارد تومان"
 */
export function formatCompactPrice(
  toman: number | null | undefined,
): string {
  if (
    toman === null ||
    toman === undefined ||
    !Number.isFinite(toman) ||
    toman < 0
  ) {
    return PRICE_UNAVAILABLE_FA;
  }

  if (toman >= 1_000_000_000) {
    const value = (toman / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toPersianDigits(value.replace(".", "٫"))} میلیارد تومان`;
  }

  if (toman >= 1_000_000) {
    const value = (toman / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toPersianDigits(value.replace(".", "٫"))} میلیون تومان`;
  }

  if (toman >= 1_000) {
    const value = Math.round(toman / 1_000).toString();
    return `${toPersianDigits(value)} هزار تومان`;
  }

  return `${toPersianDigits(toman)} تومان`;
}

/** فقط عدد با جداکننده، بدون واحد. برای جاهایی که واحد جدا نمایش داده می‌شود. */
export function formatNumberFa(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }
  const grouped = Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, PERSIAN_THOUSANDS_SEP);
  return toPersianDigits(grouped);
}