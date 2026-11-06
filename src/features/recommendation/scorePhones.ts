/**
 * موتور توصیه‌ی SmartPick — قطعی (deterministic)، بدون AI، بدون تصادف.
 *
 * ورودی: لیست گوشی‌ها + ترجیحات کاربر + گزینه‌ها.
 * خروجی: گوشی‌های امتیازدهی‌شده به‌ترتیب تطابق، به‌همراه توضیح‌ها.
 *
 * قواعد اساسی (طبق spec):
 *  - هر امتیاز ویژگی از ۱ تا ۱۰ است؛ null یعنی «امتیازدهی نشده».
 *  - null هرگز به‌عنوان صفر یا ده حساب نمی‌شود.
 *  - داده‌ی ناقص با کاهش «پوشش» (coverage) جریمه می‌شود، نه با جعل داده.
 *  - بودجه: قیمت نامشخص ≠ قابل خرید. همیشه شفاف اعلام می‌شود.
 *  - برند فقط یک امتیاز کوچک (+۳ از ۱۰۰) اضافه می‌کند — نه بیشتر.
 *  - خروجی همیشه ۰ تا ۱۰۰ نرمال‌شده است.
 */

import type { Phone, PhoneScores } from "../../types/phone";
import {
  DEFAULT_PRIORITIES,
  FEATURE_KEYS,
  USAGE_DEFAULT_WEIGHTS,
  type BrandPreference,
  type PriorityWeights,
  type UserPreferences,
} from "../../types/preferences";
import {
  generateDataNotes,
  generateMatchNotes,
  generateStrengths,
  generateWeaknesses,
} from "./explanations";

/* ============================================================
 * Types
 * ============================================================ */

export type BudgetStatus = "within" | "over" | "unknown" | "unlimited";

export type DataQuality = "complete" | "partial" | "limited" | "none";

export interface ScoredPhone {
  phone: Phone;
  /** امتیاز تطابق نهایی ۰ تا ۱۰۰ */
  matchScore: number;
  /** پوشش داده ۰ تا ۱ — نسبت وزنی ویژگی‌های دارای امتیاز به کل وزن‌ها */
  dataCoverage: number;
  dataQuality: DataQuality;
  budgetStatus: BudgetStatus;
  strengths: string[];
  weaknesses: string[];
  /** دلایل مثبت تطابق (مثلاً هماهنگی برند) */
  matchNotes: string[];
  /** هشدارهای کیفیت داده */
  dataNotes: string[];
}

export interface RecommendationMeta {
  totalPhones: number;
  consideredCount: number;
  excludedCount: number;
  /** وزن‌های مؤثر مورد استفاده در امتیازدهی (برای نمایش در UI) */
  effectiveWeights: PriorityWeights;
}

export interface RecommendationResult {
  /** همه‌ی گوشی‌های امتیازدهی‌شده، مرتب‌شده نزولی */
  scoredPhones: ScoredPhone[];
  /** بهترین تطابق (اگر موجود باشد) */
  bestMatch: ScoredPhone | null;
  /** بقیه‌ی گزینه‌ها (بدون بهترین) */
  alternatives: ScoredPhone[];
  meta: RecommendationMeta;
}

export interface RecommendOptions {
  /** آیا گوشی‌های خارج از بودجه یا با قیمت نامشخص هم نمایش داده شوند؟ */
  includeOutOfBudget: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */

/** حداکثر امتیاز اضافه‌ی برند — به‌اندازه‌ای کوچک که بر انتخاب فنی غلبه نکند. */
const BRAND_BONUS_POINTS = 3;

/**
 * حداقل ضریب تعدیل داده‌ی ناقص.
 * coverage=0 → 0.7، coverage=1 → 1.0.
 * نمی‌خواهیم امتیاز صفر شود، فقط جریمه‌ی معقول.
 */
const COVERAGE_FLOOR = 0.7;
const COVERAGE_RANGE = 0.3;

/* ============================================================
 * Public API
 * ============================================================ */

export function recommendPhones(
  phones: Phone[],
  preferences: UserPreferences,
  options: RecommendOptions = { includeOutOfBudget: false },
): RecommendationResult {
  const effectiveWeights = getEffectiveWeights(preferences);
  const totalPhones = phones.length;

  // ۱) امتیازدهی همه‌ی گوشی‌ها (بدون فیلتر بودجه)
  const allScored: ScoredPhone[] = [];
  for (const phone of phones) {
    const scored = scoreOnePhone(phone, preferences, effectiveWeights);
    if (scored !== null) allScored.push(scored);
  }

  // ۲) فیلتر بودجه
  const considered = options.includeOutOfBudget
    ? allScored
    : allScored.filter(
        (sp) => sp.budgetStatus === "within" || sp.budgetStatus === "unlimited",
      );

  // ۳) مرتب‌سازی نزولی (پایدار — در JS از ES2019 تضمین شده)
  const sorted = [...considered].sort((a, b) => b.matchScore - a.matchScore);

  // ۴) تقسیم بهترین / جایگزین‌ها
  const bestMatch = sorted[0] ?? null;
  const alternatives = sorted.slice(1);

  return {
    scoredPhones: sorted,
    bestMatch,
    alternatives,
    meta: {
      totalPhones,
      consideredCount: sorted.length,
      excludedCount: totalPhones - sorted.length,
      effectiveWeights,
    },
  };
}

/* ============================================================
 * Internal
 * ============================================================ */

function scoreOnePhone(
  phone: Phone,
  preferences: UserPreferences,
  weights: PriorityWeights,
): ScoredPhone | null {
  const budgetStatus = getBudgetStatus(phone, preferences);
  const scoring = computeMatchScore(
    phone.scores,
    weights,
    phone.brand,
    preferences.brandPreference,
  );

  // گوشی با هیچ امتیازی قابل توصیه نیست — به‌جای جعل، کنار گذاشته می‌شود.
  if (scoring.dataQuality === "none") return null;

  return {
    phone,
    matchScore: scoring.matchScore,
    dataCoverage: scoring.coverage,
    dataQuality: scoring.dataQuality,
    budgetStatus,
    strengths: generateStrengths(phone, weights),
    weaknesses: generateWeaknesses(phone, weights),
    matchNotes: generateMatchNotes(phone, preferences.brandPreference),
    dataNotes: generateDataNotes(scoring.coverage),
  };
}

function getBudgetStatus(
  phone: Phone,
  preferences: UserPreferences,
): BudgetStatus {
  if (preferences.unlimitedBudget) return "unlimited";
  if (preferences.budgetToman === null) return "unknown";
  if (phone.priceToman === null) return "unknown";
  return phone.priceToman <= preferences.budgetToman ? "within" : "over";
}

interface MatchScoreResult {
  matchScore: number;
  coverage: number;
  dataQuality: DataQuality;
}

function computeMatchScore(
  scores: PhoneScores,
  weights: PriorityWeights,
  brand: string,
  brandPreference: BrandPreference,
): MatchScoreResult {
  let weightedSum = 0;
  let availableWeight = 0;
  let totalWeight = 0;

  for (const key of FEATURE_KEYS) {
    const w = weights[key];
    totalWeight += w;
    const s = scores[key];
    if (s !== null) {
      weightedSum += w * s;
      availableWeight += w;
    }
  }

  // هیچ داده‌ای نداریم — نمی‌توان توصیه کرد.
  if (availableWeight === 0 || totalWeight === 0) {
    return { matchScore: 0, coverage: 0, dataQuality: "none" };
  }

  // میانگین وزنی روی داده‌ی موجود × ۱۰ → ۰ تا ۱۰۰
  const normalizedScore = (weightedSum / availableWeight) * 10;

  // پوشش = وزن ویژگی‌های امتیازدهی‌شده / وزن کل
  const coverage = availableWeight / totalWeight;
  const coverageFactor = COVERAGE_FLOOR + COVERAGE_RANGE * coverage;
  let finalScore = normalizedScore * coverageFactor;

  // بونوس برند: کوچک، شفاف، فقط اگر ترجیح داده شده باشد
  if (
    brandPreference !== "no_preference" &&
    brand === brandPreference
  ) {
    finalScore += BRAND_BONUS_POINTS;
  }

  // کلمپ ۰ تا ۱۰۰
  finalScore = Math.max(0, Math.min(100, finalScore));

  const dataQuality: DataQuality =
    coverage >= 0.999 ? "complete" : coverage >= 0.5 ? "partial" : "limited";

  return {
    matchScore: Math.round(finalScore),
    coverage,
    dataQuality,
  };
}

/**
 * وزن‌های مؤثر:
 *  - اگر کاربر وزن‌ها را از پیش‌فرض خنثی (همه ۵) تغییر نداده،
 *    از وزن‌های پیش‌فرض نوع استفاده استفاده می‌کنیم.
 *  - در غیر این صورت وزن‌های خود کاربر ملاک است.
 */
function getEffectiveWeights(preferences: UserPreferences): PriorityWeights {
  const p = preferences.priorities;
  const isDefault = FEATURE_KEYS.every(
    (k) => p[k] === DEFAULT_PRIORITIES[k],
  );
  if (isDefault) {
    return { ...USAGE_DEFAULT_WEIGHTS[preferences.primaryUsage] };
  }
  return { ...p };
}