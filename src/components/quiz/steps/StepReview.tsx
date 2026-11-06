import type { ReactNode } from "react";
import {
  Wallet,
  Smartphone,
  SlidersHorizontal,
  Tag,
  Pencil,
  RotateCcw,
} from "lucide-react";
import StepShell from "./StepShell";
import Button from "../../common/Button";
import {
  FEATURE_KEYS,
  FEATURE_LABELS_FA,
  PRIMARY_USAGE_LABELS_FA,
  BRAND_PREFERENCE_LABELS_FA,
  type UserPreferences,
} from "../../../types/preferences";
import { formatPrice, toPersianDigits } from "../../../utils/formatPrice";

export interface StepReviewProps {
  preferences: UserPreferences;
  /** پرش به گام مشخص (۰=بودجه، ۱=کاربرد، ۲=اولویت‌ها، ۳=برند) */
  onGoToStep: (step: number) => void;
  /** ریست کامل پرسش‌نامه */
  onReset: () => void;
}

export default function StepReview({
  preferences,
  onGoToStep,
  onReset,
}: StepReviewProps) {
  const budgetText = preferences.unlimitedBudget
    ? "بدون محدودیت"
    : preferences.budgetToman !== null && preferences.budgetToman > 0
      ? formatPrice(preferences.budgetToman)
      : "تنظیم نشده";

  // مرتب‌سازی نزولی برای نمایش اولویت‌های مهم‌تر در بالا
  const sortedPriorities = [...FEATURE_KEYS].sort(
    (a, b) => preferences.priorities[b] - preferences.priorities[a],
  );

  return (
    <StepShell
      title="مرور پاسخ‌هایت"
      description="پاسخ‌ها را بررسی کن. اگر جایی نیاز به تغییر دارد، روی «ویرایش» همان بخش بزن."
    >
      <div className="quiz-review">
        <ReviewItem
          icon={<Wallet size={16} aria-hidden="true" />}
          label="بودجه"
          value={budgetText}
          onEdit={() => onGoToStep(0)}
        />
        <ReviewItem
          icon={<Smartphone size={16} aria-hidden="true" />}
          label="نوع استفاده"
          value={PRIMARY_USAGE_LABELS_FA[preferences.primaryUsage]}
          onEdit={() => onGoToStep(1)}
        />
        <ReviewItem
          icon={<SlidersHorizontal size={16} aria-hidden="true" />}
          label="اولویت‌ها"
          value={
            <ul className="quiz-review__priorities">
              {sortedPriorities.map((key) => (
                <li key={key}>
                  <span>{FEATURE_LABELS_FA[key]}</span>
                  <span className="quiz-review__weight">
                    {toPersianDigits(preferences.priorities[key])} از ۱۰
                  </span>
                </li>
              ))}
            </ul>
          }
          onEdit={() => onGoToStep(2)}
        />
        <ReviewItem
          icon={<Tag size={16} aria-hidden="true" />}
          label="برند ترجیحی"
          value={BRAND_PREFERENCE_LABELS_FA[preferences.brandPreference]}
          onEdit={() => onGoToStep(3)}
        />

        <div className="quiz-review__reset">
          <Button
            variant="ghost"
            size="sm"
            startIcon={<RotateCcw size={16} />}
            onClick={onReset}
          >
            شروع دوباره‌ی پرسش‌نامه
          </Button>
        </div>
      </div>
    </StepShell>
  );
}

/* ---------------- Sub-component ---------------- */

interface ReviewItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  onEdit: () => void;
}

function ReviewItem({ icon, label, value, onEdit }: ReviewItemProps) {
  return (
    <div className="quiz-review__item">
      <div className="quiz-review__head">
        <span className="quiz-review__label">
          {icon}
          {label}
        </span>
        <button
          type="button"
          className="quiz-review__edit"
          onClick={onEdit}
          aria-label={`ویرایش ${label}`}
        >
          <Pencil size={12} aria-hidden="true" />
          <span>ویرایش</span>
        </button>
      </div>
      <div className="quiz-review__value">{value}</div>
    </div>
  );
}