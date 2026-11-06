import type { ChangeEvent } from "react";
import { Wallet, Infinity as InfinityIcon } from "lucide-react";
import StepShell from "./StepShell";
import { formatPrice } from "../../../utils/formatPrice";
import type { UserPreferences } from "../../../types/preferences";

export interface StepBudgetProps {
  preferences: UserPreferences;
  onChange: (partial: Partial<UserPreferences>) => void;
}

/** سقف امنیتی برای جلوگیری از ورودی‌های غیرواقعی (۵ میلیارد تومان). */
const MAX_BUDGET_TOMAN = 5_000_000_000;

/** تبدیل ارقام فارسی/عربی به لاتین و حذف هر کاراکتر غیررقمی. */
function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, "");
}

export default function StepBudget({ preferences, onChange }: StepBudgetProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = normalizeDigits(e.target.value);
    if (digitsOnly === "") {
      onChange({ budgetToman: null });
      return;
    }
    const parsed = Number(digitsOnly);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    onChange({ budgetToman: Math.min(parsed, MAX_BUDGET_TOMAN) });
  };

  const handleToggleUnlimited = () => {
    if (preferences.unlimitedBudget) {
      onChange({ unlimitedBudget: false });
    } else {
      onChange({ unlimitedBudget: true, budgetToman: null });
    }
  };

  const inputValue =
    preferences.budgetToman === null ? "" : String(preferences.budgetToman);

  return (
    <StepShell
      title="بودجه‌ات چقدر است؟"
      description="مشخص کن چقدر می‌خواهی برای خرید گوشی هزینه کنی. گوشی‌های خارج از بودجه به‌طور پیش‌فرض در نتایج نشان داده نمی‌شوند."
    >
      <div className="quiz-budget">
        <label htmlFor="quiz-budget-input" className="quiz-budget__label">
          <Wallet size={16} aria-hidden="true" />
          بودجه به تومان
        </label>

        <div className="quiz-budget__input-wrapper">
          <input
            id="quiz-budget-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className="quiz-budget__input"
            placeholder="50000000"
            value={inputValue}
            onChange={handleInputChange}
            disabled={preferences.unlimitedBudget}
            aria-describedby="quiz-budget-preview"
          />
          <span className="quiz-budget__unit" aria-hidden="true">
            تومان
          </span>
        </div>

        <div id="quiz-budget-preview" aria-live="polite">
          {preferences.unlimitedBudget ? (
            <p className="quiz-budget__preview">
              بدون محدودیت بودجه: هیچ گوشی‌ای به‌خاطر قیمت حذف نمی‌شود.
            </p>
          ) : preferences.budgetToman !== null && preferences.budgetToman > 0 ? (
            <p className="quiz-budget__preview">
              بودجه‌ی شما:{" "}
              <strong>{formatPrice(preferences.budgetToman)}</strong>
            </p>
          ) : (
            <p className="quiz-budget__preview">
              برای ادامه، بودجه را وارد کن یا گزینه‌ی «بدون محدودیت» را انتخاب کن.
            </p>
          )}
        </div>

        <button
          type="button"
          className={
            "quiz-budget__unlimited" +
            (preferences.unlimitedBudget
              ? " quiz-budget__unlimited--active"
              : "")
          }
          onClick={handleToggleUnlimited}
          aria-pressed={preferences.unlimitedBudget}
        >
          <InfinityIcon size={16} aria-hidden="true" />
          <span>بدون محدودیت بودجه</span>
        </button>
      </div>
    </StepShell>
  );
}