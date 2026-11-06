import type { ReactNode } from "react";
import "./EmptyState.css";

export interface EmptyStateProps {
  /** آیکون (معمولاً از lucide-react) */
  icon?: ReactNode;
  /** عنوان کوتاه */
  title: string;
  /** توضیح تکمیلی (اختیاری) */
  description?: string;
  /** دکمه یا لینک اکشن (اختیاری) */
  action?: ReactNode;
  className?: string;
}

/**
 * حالت خالی برای جاهایی که محتوا وجود ندارد:
 * - سبد مقایسه خالی
 * - فهرست علاقه‌مندی‌های خالی
 * - نتیجه‌ی فیلتر ناموفق
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const classes = ["empty-state", className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status">
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}