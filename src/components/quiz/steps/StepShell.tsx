import type { ReactNode } from "react";

export interface StepShellProps {
  /** عنوان بزرگ گام */
  title: string;
  /** توضیح کوتاه زیر عنوان */
  description: string;
  /** محتوای اصلی گام */
  children: ReactNode;
}

/**
 * پوسته‌ی مشترک همه‌ی گام‌های پرسش‌نامه.
 * فقط چیدمان (عنوان + توضیح + محتوا) را فراهم می‌کند.
 * استایل‌ها در steps.css تعریف شده‌اند.
 */
export default function StepShell({
  title,
  description,
  children,
}: StepShellProps) {
  return (
    <div className="quiz-step">
      <div className="quiz-step__head">
        <h2 className="quiz-step__title">{title}</h2>
        <p className="quiz-step__description">{description}</p>
      </div>
      <div className="quiz-step__body">{children}</div>
    </div>
  );
}