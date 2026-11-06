import { useState } from "react";
import { Smartphone } from "lucide-react";
import { getPhoneImagePath } from "../../utils/getAssetPath";
import { PHONE_BRAND_LABELS_FA, type PhoneBrand } from "../../types/phone";
import "./PhoneImage.css";

export type PhoneImageRatio = "square" | "portrait" | "wide";

export interface PhoneImageProps {
  /** نام فایل تصویر در public/images/phones — یا null */
  imagePath: string | null;
  /** توضیح دسترس‌پذیر (alt) */
  alt: string;
  /** برند برای رنگ/برچسب placeholder */
  brand?: PhoneBrand;
  /** نام مدل برای نمایش در placeholder */
  model?: string;
  /** نسبت تصویر */
  ratio?: PhoneImageRatio;
  /** بارگذاری eager (برای hero یا اولین کارت) */
  priority?: boolean;
  className?: string;
}

/**
 * تصویر گوشی با fallback طراحی‌شده.
 *
 * رفتار:
 *  - اگر imagePath خالی باشد → placeholder.
 *  - اگر تصویر در runtime خطا بدهد (404، فرمت خراب) → placeholder.
 *  - هرگز آیکون broken image نشان نمی‌دهد.
 *  - نسبت ابعاد همیشه با aspect-ratio حفظ می‌شود تا layout نلرزد.
 *  - placeholder ساختاری با آیکون + برند + مدل + توضیح است.
 */
export default function PhoneImage({
  imagePath,
  alt,
  brand,
  model,
  ratio = "portrait",
  priority = false,
  className,
}: PhoneImageProps) {
  const [hasError, setHasError] = useState(false);

  const resolved = getPhoneImagePath(imagePath);
  const showPlaceholder = !resolved || hasError;

  const classes = ["phone-image", `phone-image--${ratio}`, className]
    .filter(Boolean)
    .join(" ");

  if (showPlaceholder) {
    const brandLabel = brand ? PHONE_BRAND_LABELS_FA[brand] : null;

    return (
      <div
        className={`${classes} phone-image--placeholder`}
        role="img"
        aria-label={alt}
        data-brand={brand ?? undefined}
      >
        <div className="phone-image__placeholder-inner">
          <span className="phone-image__placeholder-icon" aria-hidden="true">
            <Smartphone size={38} strokeWidth={1.5} />
          </span>
          {brandLabel && (
            <span className="phone-image__placeholder-brand">{brandLabel}</span>
          )}
          {model && (
            <span className="phone-image__placeholder-model latin">
              {model}
            </span>
          )}
          <span className="phone-image__placeholder-note">تصویر موجود نیست</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <img
        src={resolved}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  );
}