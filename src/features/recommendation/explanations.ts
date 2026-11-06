/**
 * تولید توضیح‌های فارسی برای توصیه‌ها — بر اساس داده‌ی واقعی.
 *
 * اصل: هیچ توضیحی ساخته نمی‌شود مگر داده‌ی متناظرش در رکورد موجود باشد.
 * اگر امتیاز ویژگی null باشد، هیچ جمله‌ای دربارهٔ آن تولید نمی‌شود.
 */

import type { Phone, PhoneScores } from "../../types/phone";
import {
  FEATURE_KEYS,
  type BrandPreference,
  type FeatureKey,
  type PriorityWeights,
} from "../../types/preferences";

/* ---------------- Strengths ---------------- */

interface RankedFeature {
  key: FeatureKey;
  score: number;
  weight: number;
}

/**
 * مرتب‌سازی ویژگی‌ها بر اساس «اهمیت × کیفیت».
 * وزن بالا + امتیاز بالا = بیشترین سهم در تطابق.
 */
function rankAvailableFeatures(
  scores: PhoneScores,
  weights: PriorityWeights,
): RankedFeature[] {
  const ranked: RankedFeature[] = [];
  for (const key of FEATURE_KEYS) {
    const score = scores[key];
    if (score === null) continue;
    ranked.push({ key, score, weight: weights[key] });
  }
  return ranked;
}

const STRENGTH_TEMPLATES: Record<FeatureKey, string> = {
  camera: "دوربین قدرتمندی دارد.",
  performance: "کارایی بالایی دارد.",
  battery: "باتری بادوامی دارد.",
  display: "نمایشگر باکیفیتی دارد.",
  software: "تجربه‌ی نرم‌افزاری روانی ارائه می‌دهد.",
  gaming: "برای بازی گزینه‌ی مناسبی است.",
};

const WEAKNESS_TEMPLATES: Record<FeatureKey, string> = {
  camera: "دوربین آن انتظارات شما را برآورده نمی‌کند.",
  performance: "کارایی آن برای نیاز شما کافی نیست.",
  battery: "باتری آن نسبت به انتظار شما ضعیف‌تر است.",
  display: "نمایشگر آن کیفیت مورد انتظار شما را ندارد.",
  software: "نرم‌افزار آن ممکن است رضایت‌بخش نباشد.",
  gaming: "برای بازی مناسب نیست.",
};

/**
 * نقاط قوت گوشی — فقط ویژگی‌هایی که:
 *   - امتیاز >= ۷ دارند (واقعاً خوب‌اند)
 *   - وزن >= ۵ دارند (کاربر به آن‌ها اهمیت می‌دهد)
 * مرتب‌سازی نزولی بر اساس وزن × امتیاز (بیشترین سهم اول).
 * حداکثر ۳ مورد.
 */
export function generateStrengths(
  phone: Phone,
  weights: PriorityWeights,
): string[] {
  const candidates = rankAvailableFeatures(phone.scores, weights)
    .filter((f) => f.score >= 7 && f.weight >= 5)
    .sort((a, b) => b.weight * b.score - a.weight * a.score);

  return candidates
    .slice(0, 3)
    .map((f) => STRENGTH_TEMPLATES[f.key]);
}

/**
 * نقاط ضعف — ویژگی‌هایی که:
 *   - امتیاز < ۵ دارند (زیر میانگین)
 *   - وزن >= ۵ دارند (کاربر به آن‌ها اهمیت می‌دهد)
 * مرتب‌سازی نزولی بر اساس وزن × (۵ − امتیاز) — بیشترین «نگرانی» اول.
 * حداکثر ۲ مورد.
 */
export function generateWeaknesses(
  phone: Phone,
  weights: PriorityWeights,
): string[] {
  const candidates = rankAvailableFeatures(phone.scores, weights)
    .filter((f) => f.score < 5 && f.weight >= 5)
    .sort(
      (a, b) =>
        b.weight * (5 - b.score) - a.weight * (5 - a.score),
    );

  return candidates
    .slice(0, 2)
    .map((f) => WEAKNESS_TEMPLATES[f.key]);
}

/* ---------------- Notes ---------------- */

/**
 * یادداشت‌های «چرا این گوشی برای تو» — شامل هماهنگی برند.
 * (وضعیت بودجه در UI به‌صورت badge جدا نشان داده می‌شود.)
 */
export function generateMatchNotes(
  phone: Phone,
  brandPreference: BrandPreference,
): string[] {
  const notes: string[] = [];
  if (
    brandPreference !== "no_preference" &&
    phone.brand === brandPreference
  ) {
    notes.push("با ترجیح برند شما هماهنگ است.");
  }
  return notes;
}

/**
 * هشدارهای کیفیت داده — بر اساس پوشش (coverage) که از الگوریتم می‌آید.
 */
export function generateDataNotes(coverage: number): string[] {
  const notes: string[] = [];
  if (coverage >= 0.999) return notes;

  if (coverage >= 0.5) {
    notes.push("این پیشنهاد بر اساس داده‌ی ناقص است.");
  } else {
    notes.push(
      "داده‌ی محدودی برای این گوشی موجود است؛ پیشنهاد را با احتیاط بررسی کن.",
    );
  }
  return notes;
}