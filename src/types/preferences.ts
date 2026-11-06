/**
 * تیپ‌های ترجیحات کاربر و وزن‌های پیش‌فرض الگوریتم توصیه.
 *
 * قواعد کلیدی:
 * - بودجه می‌تواند نامحدود باشد (unlimitedBudget: true).
 * - وزن هر ویژگی از ۰ (بی‌اهمیت) تا ۱۰ (بحرانی) است.
 * - ترجیح برند اجباری نیست و باید حداقل اثر را روی امتیاز فنی داشته باشد.
 */

import type { PhoneBrand } from "./phone";

export type PrimaryUsage =
  | "gaming"
  | "photography"
  | "everyday"
  | "studying_work"
  | "content_creation";

/** کلید ویژگی‌های قابل وزن‌دهی؛ هم‌راستا با PhoneScores. */
export type FeatureKey =
  | "camera"
  | "performance"
  | "battery"
  | "display"
  | "software"
  | "gaming";

export const FEATURE_KEYS: readonly FeatureKey[] = [
  "camera",
  "performance",
  "battery",
  "display",
  "software",
  "gaming",
];

export const FEATURE_LABELS_FA: Record<FeatureKey, string> = {
  camera: "دوربین",
  performance: "کارایی",
  battery: "باتری",
  display: "صفحه‌نمایش",
  software: "نرم‌افزار",
  gaming: "بازی",
};

export const PRIMARY_USAGE_LABELS_FA: Record<PrimaryUsage, string> = {
  gaming: "بازی",
  photography: "عکاسی",
  everyday: "استفاده‌ی روزمره",
  studying_work: "درس و کار",
  content_creation: "تولید محتوا",
};

/** وزن هر ویژگی از ۰ تا ۱۰. */
export type PriorityWeights = Record<FeatureKey, number>;

export type BrandPreference = PhoneBrand | "no_preference";

export const BRAND_PREFERENCE_LABELS_FA: Record<BrandPreference, string> = {
  samsung: "سامسونگ",
  xiaomi: "شیائومی",
  apple: "اپل",
  google: "گوگل",
  no_preference: "بدون ترجیح",
};

export interface UserPreferences {
  /** بودجه به تومان؛ null یعنی نامحدود یا هنوز تنظیم نشده. */
  budgetToman: number | null;
  unlimitedBudget: boolean;
  primaryUsage: PrimaryUsage;
  priorities: PriorityWeights;
  brandPreference: BrandPreference;
}

/** وزن‌های پیش‌فرض خنثی (همه ۵) — پایه‌ی اسلایدرهای پرسش‌نامه. */
export const DEFAULT_PRIORITIES: PriorityWeights = {
  camera: 5,
  performance: 5,
  battery: 5,
  display: 5,
  software: 5,
  gaming: 5,
};

/**
 * وزن‌های پیش‌فرض بر اساس نوع استفاده‌ی اصلی.
 * در پرسش‌نامه به‌عنوان نقطه‌ی شروع اسلایدرها استفاده می‌شود
 * و در موتور توصیه اگر کاربر وزن خاصی نداده باشد، همین‌ها اعمال می‌شوند.
 */
export const USAGE_DEFAULT_WEIGHTS: Record<PrimaryUsage, PriorityWeights> = {
  gaming: {
    camera: 3,
    performance: 9,
    battery: 6,
    display: 8,
    software: 5,
    gaming: 10,
  },
  photography: {
    camera: 10,
    performance: 6,
    battery: 6,
    display: 7,
    software: 5,
    gaming: 3,
  },
  everyday: {
    camera: 6,
    performance: 6,
    battery: 8,
    display: 6,
    software: 7,
    gaming: 4,
  },
  studying_work: {
    camera: 4,
    performance: 7,
    battery: 8,
    display: 6,
    software: 7,
    gaming: 3,
  },
  content_creation: {
    camera: 9,
    performance: 7,
    battery: 6,
    display: 8,
    software: 6,
    gaming: 4,
  },
};

/** ساخت یک شیء ترجیحات با مقادیر امن و خنثی. */
export function createDefaultPreferences(): UserPreferences {
  return {
    budgetToman: null,
    unlimitedBudget: false,
    primaryUsage: "everyday",
    priorities: { ...DEFAULT_PRIORITIES },
    brandPreference: "no_preference",
  };
}