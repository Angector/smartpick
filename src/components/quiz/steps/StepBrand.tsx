import StepShell from "./StepShell";
import {
  BRAND_PREFERENCE_LABELS_FA,
  type BrandPreference,
  type UserPreferences,
} from "../../../types/preferences";

export interface StepBrandProps {
  preferences: UserPreferences;
  onChange: (partial: Partial<UserPreferences>) => void;
}

const BRAND_OPTIONS: BrandPreference[] = [
  "samsung",
  "xiaomi",
  "apple",
  "google",
  "no_preference",
];

export default function StepBrand({ preferences, onChange }: StepBrandProps) {
  return (
    <StepShell
      title="برند خاصی مدنظرت هست؟"
      description="ترجیح برند فقط یک مزیت کوچک در رتبه‌بندی ایجاد می‌کند و باعث نادیده گرفتن گزینه‌های بهتر نمی‌شود. اگر ترجیحی نداری، «بدون ترجیح» را انتخاب کن."
    >
      <div
        className="quiz-options quiz-options--compact"
        role="radiogroup"
        aria-label="برند مورد نظر"
      >
        {BRAND_OPTIONS.map((brand) => {
          const selected = preferences.brandPreference === brand;
          return (
            <button
              key={brand}
              type="button"
              role="radio"
              aria-checked={selected}
              className={
                "quiz-option quiz-option--pill" +
                (selected ? " quiz-option--selected" : "")
              }
              onClick={() => onChange({ brandPreference: brand })}
            >
              <span className="quiz-option__title">
                {BRAND_PREFERENCE_LABELS_FA[brand]}
              </span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}