import { toPersianDigits } from "../../utils/formatPrice";
import "./ProgressBar.css";

export interface ProgressBarProps {
  /** ایندکس گام فعلی (۰ تا totalSteps-1) */
  currentStep: number;
  totalSteps: number;
  /** برچسب کوتاه هر گام به‌ترتیب */
  stepLabels: string[];
}

/**
 * نوار پیشرفت پرسش‌نامه.
 *
 * - نوار افقی با gradient accent.
 * - زیرنوار قطعه‌قطعه: هر گام یک بخش.
 * - برچسب «گام X از Y» و عنوان گام فعلی.
 * - کامل دسترس‌پذیر: role="progressbar" با aria-valuenow و aria-valuetext.
 */
export default function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressBarProps) {
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;
  const currentLabel = stepLabels[currentStep] ?? "";

  return (
    <div className="progress-bar" aria-label="پیشرفت پرسش‌نامه">
      <div className="progress-bar__header">
        <span className="progress-bar__step">
          گام {toPersianDigits(currentStep + 1)} از {toPersianDigits(totalSteps)}
        </span>
        <span className="progress-bar__label">{currentLabel}</span>
      </div>

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep + 1}
        aria-valuetext={`گام ${toPersianDigits(currentStep + 1)} از ${toPersianDigits(totalSteps)}`}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ol className="progress-bar__dots" aria-hidden="true">
        {stepLabels.map((label, i) => {
          const classes = ["progress-bar__dot"];
          if (i < currentStep) classes.push("completed");
          if (i === currentStep) classes.push("active");
          return (
            <li key={label} className={classes.join(" ")}>
              <span className="sr-only">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}