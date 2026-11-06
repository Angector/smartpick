import { Heart, Info, GitCompareArrows, ShieldAlert } from "lucide-react";
import PhoneImage from "./PhoneImage";
import Button from "../common/Button";
import {
  formatCompactPrice,
  PRICE_UNAVAILABLE_FA,
  toPersianDigits,
} from "../../utils/formatPrice";
import { PHONE_BRAND_LABELS_FA, type Phone } from "../../types/phone";
import "./PhoneCard.css";

export interface PhoneCardProps {
  phone: Phone;
  /** امتیاز تطابق ۰–۱۰۰؛ اگر داده نشود، نوار تطابق مخفی می‌شود. */
  matchScore?: number;
  /** آیا این گوشی در علاقه‌مندی‌هاست؟ */
  isFavorite: boolean;
  /** تغییر وضعیت علاقه‌مندی */
  onToggleFavorite: (phoneId: string) => void;
  /** اگر داده شود، دکمه‌ی «جزئیات» نمایش داده می‌شود. */
  onOpenDetails?: (phone: Phone) => void;
  /** آیا این گوشی در سبد مقایسه است؟ */
  isInCompare?: boolean;
  /** آیا می‌توان به مقایسه اضافه کرد؟ */
  canCompare?: boolean;
  /** تغییر وضعیت مقایسه */
  onToggleCompare?: (phone: Phone) => void;
}

function getMatchTier(score: number): "excellent" | "good" | "fair" {
  if (score >= 85) return "excellent";
  if (score >= 60) return "good";
  return "fair";
}

/**
 * کارت گوشی در کاتالوگ و نتایج.
 *
 * - دکمه‌ی علاقه‌مندی همیشه فعال است.
 * - دکمه‌ی مقایسه فقط وقتی onToggleCompare داده شود ظاهر می‌شود.
 * - دکمه‌ی جزئیات فقط وقتی onOpenDetails داده شود ظاهر می‌شود.
 * - اگر هیچ callback اکشنی داده نشود، نوار اکشن کاملاً رندر نمی‌شود.
 */
export default function PhoneCard({
  phone,
  matchScore,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  isInCompare = false,
  canCompare = true,
  onToggleCompare,
}: PhoneCardProps) {
  const brandLabel = PHONE_BRAND_LABELS_FA[phone.brand];
  const priceText =
    phone.priceToman === null
      ? PRICE_UNAVAILABLE_FA
      : formatCompactPrice(phone.priceToman);

  const priceUnknown = phone.priceToman === null;
  const priceUnverified = !priceUnknown && !phone.priceVerified;

  const topAdvantages = phone.advantages.slice(0, 2);

  const compareDisabled = !isInCompare && !canCompare;
  const hasActions = Boolean(onToggleCompare || onOpenDetails);

  return (
    <article className="phone-card">
      <div className="phone-card__media">
        <PhoneImage
          imagePath={phone.imagePath}
          alt={`${brandLabel} ${phone.model}`}
          brand={phone.brand}
          model={phone.model}
        />
        {phone.isDemo && (
          <span
            className="phone-card__demo-badge"
            title="این رکورد صرفاً برای تست رابط و الگوریتم است"
          >
            <ShieldAlert size={12} aria-hidden="true" />
            <span>دمو</span>
          </span>
        )}
      </div>

      <div className="phone-card__body">
        <div className="phone-card__header">
          <div className="phone-card__identity">
            <span className="phone-card__brand">{brandLabel}</span>
            <h3 className="phone-card__model latin">{phone.model}</h3>
          </div>

          <button
            type="button"
            className={
              "phone-card__favorite" +
              (isFavorite ? " phone-card__favorite--active" : "")
            }
            onClick={() => onToggleFavorite(phone.id)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `حذف ${brandLabel} ${phone.model} از علاقه‌مندی‌ها`
                : `افزودن ${brandLabel} ${phone.model} به علاقه‌مندی‌ها`
            }
          >
            <Heart
              size={18}
              strokeWidth={2}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>

        {matchScore !== undefined && (
          <div
            className={`phone-card__match phone-card__match--${getMatchTier(
              matchScore,
            )}`}
            aria-label={`امتیاز تطابق: ${Math.round(matchScore)} از ۱۰۰`}
          >
            <div className="phone-card__match-header">
              <span className="phone-card__match-label">تطابق با نیازت</span>
              <span className="phone-card__match-value">
                {toPersianDigits(Math.round(matchScore))}٪
              </span>
            </div>
            <div className="phone-card__match-bar">
              <div
                className="phone-card__match-fill"
                style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
              />
            </div>
          </div>
        )}

        <div className="phone-card__price-row">
          <span
            className={
              "phone-card__price" +
              (priceUnknown ? " phone-card__price--unknown" : "")
            }
          >
            {priceText}
          </span>
          {priceUnverified && (
            <span
              className="phone-card__price-note"
              title="این قیمت تأیید نشده است"
            >
              <Info size={14} aria-hidden="true" />
              <span className="sr-only">قیمت تأیید نشده</span>
            </span>
          )}
        </div>

        {topAdvantages.length > 0 && (
          <ul className="phone-card__advantages" aria-label="مزایا">
            {topAdvantages.map((adv) => (
              <li key={adv}>{adv}</li>
            ))}
          </ul>
        )}

        {hasActions && (
          <div className="phone-card__actions">
            {onToggleCompare && (
              <Button
                variant={isInCompare ? "primary" : "secondary"}
                size="sm"
                startIcon={<GitCompareArrows size={16} />}
                onClick={() => onToggleCompare(phone)}
                disabled={compareDisabled}
                aria-pressed={isInCompare}
                title={
                  compareDisabled
                    ? "حداکثر سه گوشی قابل مقایسه است"
                    : undefined
                }
              >
                {isInCompare ? "در حال مقایسه" : "افزودن به مقایسه"}
              </Button>
            )}

            {onOpenDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenDetails(phone)}
              >
                جزئیات
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}