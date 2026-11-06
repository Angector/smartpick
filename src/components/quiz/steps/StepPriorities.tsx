import { RotateCcw } from "lucide-react";
import StepShell from "./StepShell";
import Button from "../../common/Button";
import {
  FEATURE_KEYS,
  FEATURE_LABELS_FA,
  USAGE_DEFAULT_WEIGHTS,
  type FeatureKey,
  type UserPreferences,
} from "../../../types/preferences";
import { toPersianDigits } from "../../../utils/formatPrice";

export interface StepPrioritiesProps {
  preferences: UserPreferences;
  onChange: (partial: Partial<UserPreferences>) => void;
}

export default function StepPriorities({
  preferences,
  onChange,
}: StepPrioritiesProps) {
  const handleChange = (key: FeatureKey, value: number) => {
    onChange({
      priorities: { ...preferences.priorities, [key]: value },
    });
  };

  const handleReset = () => {
    onChange({
      priorities: { ...USAGE_DEFAULT_WEIGHTS[preferences.primaryUsage] },
    });
  };

  return (
    <StepShell
      title="کدام ویژگی‌ها برایت مهم‌ترند؟"
      description="به هر ویژگی از ۰ (بی‌اهمیت) تا ۱۰ (بحرانی) اهمیت بده. الگوریتم دقیقاً بر اساس همین وزن‌ها گوشی‌ها را امتیازدهی می‌کند."
    >
      <div className="quiz-priorities">
        {FEATURE_KEYS.map((key) => {
          const value = preferences.priorities[key];
          const inputId = `priority-${key}`;
          return (
            <div key={key} className="quiz-priority">
              <div className="quiz-priority__head">
                <label htmlFor={inputId} className="quiz-priority__label">
                  {FEATURE_LABELS_FA[key]}
                </label>
                <span className="quiz-priority__value" aria-hidden="true">
                  {toPersianDigits(value)}
                </span>
              </div>
              <input
                id={inputId}
                type="range"
                min={0}
                max={10}
                step={1}
                value={value}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                className="quiz-priority__slider"
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={value}
                aria-valuetext={`${FEATURE_LABELS_FA[key]}: ${toPersianDigits(
                  value,
                )} از ۱۰`}
              />
            </div>
          );
        })}

        <div className="quiz-priorities__footer">
          <Button
            variant="ghost"
            size="sm"
            startIcon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            بازگشت به پیشنهاد پیش‌فرض برای این نوع استفاده
          </Button>
        </div>
      </div>
    </StepShell>
  );
}