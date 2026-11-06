import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** سبک بصری دکمه. پیش‌فرض: primary */
  variant?: ButtonVariant;
  /** اندازه‌ی دکمه. پیش‌فرض: md */
  size?: ButtonSize;
  /** آیکون سمت شروع (در RTL: راست). نوعاً از lucide-react */
  startIcon?: ReactNode;
  /** آیکون سمت پایان (در RTL: چپ) */
  endIcon?: ReactNode;
  /** اشغال عرض کامل والد */
  fullWidth?: boolean;
}

/**
 * دکمه‌ی عمومی پروژه.
 *
 * - از `ButtonHTMLAttributes` ارث می‌برد، پس `onClick`, `disabled`,
 *   `aria-*` و ... بدون تعریف دستی در دسترس‌اند.
 * - `type` پیش‌فرض `button` است تا درون فرم‌ها به‌طور ناخواسته submit نکند.
 * - آیکون‌ها با `aria-hidden="true"` بسته می‌شوند؛ متن دکمه مسئول معناست.
 */
export default function Button({
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {startIcon && (
        <span className="btn__icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className="btn__label">{children}</span>
      {endIcon && (
        <span className="btn__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}