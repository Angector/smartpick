import type { ReactNode } from "react";
import "./SectionTitle.css";

export interface SectionTitleProps {
  /** برچسب کوچک بالای عنوان (اختیاری) */
  eyebrow?: string;
  /** متن اصلی عنوان */
  title: ReactNode;
  /** توضیح زیر عنوان (اختیاری) */
  description?: ReactNode;
  /** تراز محتوا: start | center | end */
  align?: "start" | "center" | "end";
  /** سطح تگ عنوان؛ پیش‌فرض h2 */
  level?: 2 | 3 | 4;
  /** استفاده در بخش‌های تیره (متن روشن) */
  onDark?: boolean;
  /** id برای ارتباط aria-labelledby */
  id?: string;
  className?: string;
}

/**
 * عنوان استاندارد بخش‌ها.
 * برای یکدستی همه‌ی بخش‌های صفحه (Feature, Compare, Quiz, Results, ...).
 */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "start",
  level = 2,
  onDark = false,
  id,
  className,
}: SectionTitleProps) {
  const classes = [
    "section-title",
    `section-title--${align}`,
    onDark ? "section-title--onDark" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const HeadingTag = `h${level}` as "h2" | "h3" | "h4";

  return (
    <div className={classes}>
      {eyebrow && <div className="section-title__eyebrow">{eyebrow}</div>}
      <HeadingTag className="section-title__title" id={id}>
        {title}
      </HeadingTag>
      {description && <p className="section-title__description">{description}</p>}
    </div>
  );
}