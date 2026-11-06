/**
 * تیپ‌های دامنه‌ی گوشی موبایل.
 *
 * قواعد کلیدی:
 * - هر فیلد نامعلوم با `null` مدل شده، نه با مقدار جعلی.
 * - امتیاز هر ویژگی از ۱ تا ۱۰ است؛ `null` یعنی «امتیازدهی نشده».
 * - `isDemo: true` یعنی این رکورد صرفاً برای تست رابط و الگوریتم است
 *   و ادعای واقعی بودن مشخصات یا قیمت ندارد.
 */

export type PhoneBrand = "samsung" | "xiaomi" | "apple" | "google";

/** برچسب فارسی برندها برای نمایش در UI. */
export const PHONE_BRAND_LABELS_FA: Record<PhoneBrand, string> = {
  samsung: "سامسونگ",
  xiaomi: "شیائومی",
  apple: "اپل",
  google: "گوگل",
};

/** امتیاز ۱ تا ۱۰ برای هر ویژگی؛ `null` = امتیاز نامشخص. */
export interface PhoneScores {
  camera: number | null;
  performance: number | null;
  battery: number | null;
  display: number | null;
  software: number | null;
  gaming: number | null;
}

export interface DisplaySpec {
  sizeInch: number | null;
  technology: string | null; // مثلاً "AMOLED" یا "IPS LCD"
  refreshRateHz: number | null;
}

export interface CameraSpec {
  mainMp: number | null;
  frontMp: number | null;
  summaryFa: string | null; // توضیح کوتاه فارسی، مثلاً "دوربین سه‌گانه ۵۰ مگاپیکسل"
}

export interface PhoneSpecs {
  display: DisplaySpec;
  processor: string | null;
  ramGb: number | null;
  storageGb: number | null;
  batteryMah: number | null;
  camera: CameraSpec;
  os: string | null;
}

export interface Phone {
  /** شناسه‌ی یکتا در کاتالوگ (kebab-case). */
  id: string;

  brand: PhoneBrand;

  /** نام مدل؛ عمداً به لاتین می‌ماند: "Galaxy S24 Ultra". */
  model: string;

  /**
   * مسیر تصویر نسبت به ریشه‌ی public/images/phones.
   * مثلاً "samsung-s24-ultra.webp".
   * `null` = تصویر تعریف نشده؛ PhoneImage placeholder نشان می‌دهد.
   */
  imagePath: string | null;

  /**
   * قیمت به تومان.
   * `null` = قیمت مشخص نیست. هرگز این مقدار را صفر حساب نکن.
   */
  priceToman: number | null;

  /**
   * اگر true باشد، قیمت در تاریخ lastPriceCheckIso بررسی شده است.
   * توجه: در نسخه‌ی فرانت‌اند فعلی، همه‌ی قیمت‌ها demo هستند و
   * مقدار این فیلد هم صرفاً برای تست UI و منطق بودجه است.
   */
  priceVerified: boolean;

  /** تاریخ آخرین بررسی قیمت به فرمت ISO 8601 (مثلاً "2025-01-15"). */
  lastPriceCheckIso: string | null;

  /** لینک منبع قیمت، در صورت وجود. */
  sourceUrl: string | null;

  specs: PhoneSpecs;
  scores: PhoneScores;

  advantages: string[];
  disadvantages: string[];

  /** اگر true باشد، این رکورد demo است و نباید به‌عنوان داده‌ی واقعی نمایش داده شود. */
  isDemo: boolean;
}