import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import ProgressBar from "./ProgressBar";
import Button from "../common/Button";
import StepBudget from "./steps/StepBudget";
import StepUsage from "./steps/StepUsage";
import StepPriorities from "./steps/StepPriorities";
import StepBrand from "./steps/StepBrand";
import StepReview from "./steps/StepReview";
import type { UserPreferences } from "../../types/preferences";
import "./QuizWizard.css";
import "./steps/steps.css";

const STEP_LABELS = [
  "بودجه",
  "نوع استفاده",
  "اولویت‌ها",
  "برند",
  "مرور",
] as const;

const TOTAL_STEPS = STEP_LABELS.length;

/**
 * آیا از گام فعلی می‌توان به گام بعد رفت؟
 * فقط گام بودجه نیاز به اعتبارسنجی دارد (باید بودجه یا «بدون محدودیت» تعیین شود).
 */
function canProceedFromStep(
  step: number,
  preferences: UserPreferences,
): boolean {
  if (step === 0) {
    return (
      preferences.unlimitedBudget ||
      (preferences.budgetToman !== null && preferences.budgetToman > 0)
    );
  }
  return true;
}

export interface QuizWizardProps {
  /** منبع حقیقت ترجیحات — از App */
  preferences: UserPreferences;
  /** هر تغییر فوراً بالا و به localStorage می‌رود */
  onChange: (partial: Partial<UserPreferences>) => void;
  /** کاربر پاسخ‌ها را تأیید کرد — برو به results */
  onFinish: () => void;
  /** ریست کامل پرسش‌نامه (به پیش‌فرض برگرد) */
  onReset: () => void;
}

export default function QuizWizard({
  preferences,
  onChange,
  onFinish,
  onReset,
}: QuizWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const canProceed = canProceedFromStep(currentStep, preferences);

  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      onFinish();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleJump = (step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  const handleReset = () => {
    onReset();
    setCurrentStep(0);
  };

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <div className="quiz__inner container">
        <h1 className="sr-only" id="quiz-title">
          پرسش‌نامه انتخاب گوشی
        </h1>

        <div className="quiz__card">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={[...STEP_LABELS]}
          />

          <div className="quiz__content" aria-live="polite">
            {currentStep === 0 && (
              <StepBudget preferences={preferences} onChange={onChange} />
            )}
            {currentStep === 1 && (
              <StepUsage preferences={preferences} onChange={onChange} />
            )}
            {currentStep === 2 && (
              <StepPriorities preferences={preferences} onChange={onChange} />
            )}
            {currentStep === 3 && (
              <StepBrand preferences={preferences} onChange={onChange} />
            )}
            {currentStep === 4 && (
              <StepReview
                preferences={preferences}
                onGoToStep={handleJump}
                onReset={handleReset}
              />
            )}
          </div>

          <div className="quiz__nav">
            <Button
              variant="ghost"
              size="md"
              startIcon={<ArrowRight size={18} />}
              onClick={handleBack}
              disabled={currentStep === 0}
              aria-label="بازگشت به گام قبل"
            >
              قبلی
            </Button>

            {!canProceed && currentStep === 0 && (
              <p className="quiz__hint" role="status">
                برای ادامه، بودجه را مشخص کن یا «بدون محدودیت» را انتخاب کن.
              </p>
            )}

            <Button
              variant="primary"
              size="md"
              endIcon={
                isLastStep ? <Sparkles size={18} /> : <ArrowLeft size={18} />
              }
              onClick={handleNext}
              disabled={!canProceed}
            >
              {isLastStep ? "شروع پیشنهاد" : "بعدی"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}