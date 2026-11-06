import { X, GitCompareArrows, Trash2 } from "lucide-react";
import Button from "../common/Button";
import PhoneImage from "../phones/PhoneImage";
import { PHONE_BRAND_LABELS_FA, type Phone } from "../../types/phone";
import { toPersianDigits } from "../../utils/formatPrice";
import "./CompareTray.css";

export interface CompareTrayProps {
  /** گوشی‌های انتخاب‌شده برای مقایسه (۱ تا ۳) */
  phones: Phone[];
  /** حذف یک گوشی از سبد */
  onRemove: (phoneId: string) => void;
  /** پاک کردن کل سبد */
  onClear: () => void;
  /** رفتن به نمای compare */
  onOpenCompare: () => void;
  /** باز کردن مودال جزئیات (کلیک روی گوشی) */
  onOpenDetails: (phone: Phone) => void;
  /** حداکثر تعداد گوشی قابل مقایسه — پیش‌فرض ۳ */
  maxCompare?: number;
}

/**
 * نوار مقایسه‌ی شناور پایین صفحه.
 *
 * - فقط وقتی حداقل یک گوشی انتخاب شده رندر می‌شود (والد این را کنترل می‌کند).
 * - در RTL از پایین-راست به پایین-چپ کشیده می‌شود.
 * - در موبایل، لیست گوشی‌ها اسکرول افقی می‌شود تا از صفحه بیرون نزند.
 */
export default function CompareTray({
  phones,
  onRemove,
  onClear,
  onOpenCompare,
  onOpenDetails,
  maxCompare = 3,
}: CompareTrayProps) {
  if (phones.length === 0) return null;

  const canCompare = phones.length >= 2;
  const remaining = maxCompare - phones.length;

  return (
    <div
      className="compare-tray"
      role="region"
      aria-label="سبد مقایسه"
    >
      <div className="compare-tray__inner container">
        <div className="compare-tray__head">
          <span className="compare-tray__title">
            <GitCompareArrows size={16} aria-hidden="true" />
            <span>
              مقایسه ({toPersianDigits(phones.length)} از{" "}
              {toPersianDigits(maxCompare)})
            </span>
          </span>
          {remaining > 0 && (
            <span className="compare-tray__hint">
              {toPersianDigits(remaining)} جای دیگر خالی است
            </span>
          )}
        </div>

        <ul className="compare-tray__phones" aria-label="گوشی‌های انتخاب‌شده">
          {phones.map((phone) => {
            const brandLabel = PHONE_BRAND_LABELS_FA[phone.brand];
            return (
              <li key={phone.id} className="compare-tray__phone">
                <button
                  type="button"
                  className="compare-tray__phone-btn"
                  onClick={() => onOpenDetails(phone)}
                  aria-label={`مشاهده‌ی جزئیات ${brandLabel} ${phone.model}`}
                >
                  <span className="compare-tray__thumb" aria-hidden="true">
                    <PhoneImage
                      imagePath={phone.imagePath}
                      alt=""
                      brand={phone.brand}
                      model={phone.model}
                      ratio="square"
                    />
                  </span>
                  <span className="compare-tray__phone-info">
                    <span className="compare-tray__phone-brand">
                      {brandLabel}
                    </span>
                    <span className="compare-tray__phone-model latin">
                      {phone.model}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="compare-tray__remove"
                  onClick={() => onRemove(phone.id)}
                  aria-label={`حذف ${brandLabel} ${phone.model} از مقایسه`}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="compare-tray__actions">
          <button
            type="button"
            className="compare-tray__clear"
            onClick={onClear}
            aria-label="پاک کردن سبد مقایسه"
          >
            <Trash2 size={14} aria-hidden="true" />
            <span>پاک کردن</span>
          </button>
          <Button
            variant="primary"
            size="sm"
            endIcon={<GitCompareArrows size={16} />}
            onClick={onOpenCompare}
            disabled={!canCompare}
            title={
              canCompare
                ? undefined
                : "برای مقایسه، حداقل دو گوشی انتخاب کن"
            }
          >
            مقایسه
          </Button>
        </div>
      </div>
    </div>
  );
}