import { useMemo, useState, type ReactNode } from "react";
import {
  Sparkles,
  Pencil,
  RotateCcw,
  AlertTriangle,
  Wallet,
  Info,
  Trophy,
  Eye,
  EyeOff,
  Heart,
  GitCompareArrows,
} from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import PhoneImage from "./PhoneImage";
import PhoneCard from "./PhoneCard";
import {
  recommendPhones,
  type BudgetStatus,
  type DataQuality,
  type ScoredPhone,
} from "../../features/recommendation/scorePhones";
import {
  formatPrice,
  PRICE_UNAVAILABLE_FA,
  toPersianDigits,
} from "../../utils/formatPrice";
import { PHONES } from "../../data/phones";
import { PHONE_BRAND_LABELS_FA, type Phone } from "../../types/phone";
import {
  PRIMARY_USAGE_LABELS_FA,
  type UserPreferences,
} from "../../types/preferences";
import type { AppView } from "../../App";
import "./RecommendationResults.css";

/** حداکثر تعداد گوشی قابل مقایسه — هماهنگ با App.tsx */
const MAX_COMPARE = 3;

export interface RecommendationResultsProps {
  preferences: UserPreferences;
  favorites: string[];
  compareIds: string[];
  onToggleFavorite: (phoneId: string) => void;
  onToggleCompare: (phone: Phone) => void;
  onOpenDetails: (phone: Phone) => void;
  onNavigate: (view: AppView) => void;
  onResetPreferences: () => void;
  phones?: Phone[];
}

export default function RecommendationResults({
  preferences,
  favorites,
  compareIds,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetails,
  onNavigate,
  onResetPreferences,
  phones = PHONES,
}: RecommendationResultsProps) {
  const [includeOutOfBudget, setIncludeOutOfBudget] = useState(false);

  const allResult = useMemo(
    () =>
      recommendPhones(phones, preferences, { includeOutOfBudget: true }),
    [phones, preferences],
  );

  const overBudgetCount = useMemo(
    () =>
      allResult.scoredPhones.filter((sp) => sp.budgetStatus === "over")
        .length,
    [allResult],
  );

  const unknownPriceCount = useMemo(
    () =>
      allResult.scoredPhones.filter((sp) => sp.budgetStatus === "unknown")
        .length,
    [allResult],
  );

  const hiddenCount = overBudgetCount + unknownPriceCount;

  const visiblePhones = useMemo(() => {
    if (includeOutOfBudget) return allResult.scoredPhones;
    return allResult.scoredPhones.filter(
      (sp) =>
        sp.budgetStatus === "within" || sp.budgetStatus === "unlimited",
    );
  }, [allResult, includeOutOfBudget]);

  const bestMatch = visiblePhones[0] ?? null;
  const alternatives = visiblePhones.slice(1);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const compareSet = useMemo(() => new Set(compareIds), [compareIds]);

  const budgetText = preferences.unlimitedBudget
    ? "بدون محدودیت"
    : preferences.budgetToman !== null && preferences.budgetToman > 0
      ? formatPrice(preferences.budgetToman)
      : "تنظیم نشده";

  if (visiblePhones.length === 0) {
    const noBudgetSet =
      !preferences.unlimitedBudget &&
      (preferences.budgetToman === null || preferences.budgetToman <= 0);

    return (
      <section className="results" aria-labelledby="results-title-empty">
        <div className="results__inner container">
          <SectionTitle
            eyebrow="نتایج پیشنهاد"
            title={<span id="results-title-empty">پیشنهادی برای نمایش نیست</span>}
            description={
              noBudgetSet
                ? "برای دیدن پیشنهادها ابتدا بودجه‌ات را در پرسش‌نامه مشخص کن."
                : "با بودجه‌ی فعلی گوشی‌ای با داده‌ی کافی پیدا نشد. بودجه را افزایش بده یا گوشی‌های خارج از بودجه را هم ببین."
            }
            align="center"
          />
          <EmptyState
            icon={<Sparkles size={28} />}
            title={noBudgetSet ? "بودجه تعیین نشده" : "گوشی‌ای پیدا نشد"}
            description={
              noBudgetSet
                ? "پرسش‌نامه را کامل کن تا پیشنهادهای دقیق ببینی."
                : "می‌توانی بودجه را تغییر بدهی یا نمایش گوشی‌های خارج از بودجه را روشن کنی."
            }
            action={
              noBudgetSet ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate("quiz")}
                >
                  تنظیم بودجه
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIncludeOutOfBudget(true)}
                >
                  نمایش گوشی‌های خارج از بودجه
                </Button>
              )
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="results__inner container">
        <SectionTitle
          eyebrow="نتایج پیشنهاد"
          title={<span id="results-title">مناسب‌ترین گوشی‌ها برای تو</span>}
          description="امتیاز تطابق بر اساس بودجه، نوع استفاده و اولویت‌هایت محاسبه شده. برای هر گوشی توضیح داده‌ایم که چرا انتخاب شده و چه محدودیتی دارد."
        />

        <div className="results__summary">
          <SummaryItem
            icon={<Wallet size={16} />}
            label="بودجه"
            value={budgetText}
          />
          <SummaryItem
            icon={<Sparkles size={16} />}
            label="نوع استفاده"
            value={PRIMARY_USAGE_LABELS_FA[preferences.primaryUsage]}
          />
          <SummaryItem
            icon={<Trophy size={16} />}
            label="در نتایج"
            value={`${toPersianDigits(visiblePhones.length)} گوشی`}
          />
        </div>

        {hiddenCount > 0 && (
          <div className="results__toolbar">
            <button
              type="button"
              className={
                "results__toggle" +
                (includeOutOfBudget ? " results__toggle--active" : "")
              }
              onClick={() => setIncludeOutOfBudget((v) => !v)}
              aria-pressed={includeOutOfBudget}
            >
              {includeOutOfBudget ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>
                {includeOutOfBudget
                  ? "پنهان کردن گوشی‌های خارج از بودجه یا با قیمت نامشخص"
                  : `نمایش ${toPersianDigits(hiddenCount)} گوشی خارج از بودجه یا با قیمت نامشخص`}
              </span>
            </button>
          </div>
        )}

        {bestMatch && (
          <BestMatchCard
            scored={bestMatch}
            isFavorite={favoriteSet.has(bestMatch.phone.id)}
            isInCompare={compareSet.has(bestMatch.phone.id)}
            canCompare={compareIds.length < MAX_COMPARE}
            onToggleFavorite={onToggleFavorite}
            onToggleCompare={onToggleCompare}
            onOpenDetails={onOpenDetails}
          />
        )}

        {alternatives.length > 0 && (
          <div className="results__alternatives">
            <h2 className="results__alternatives-title">
              گزینه‌های دیگر ({toPersianDigits(alternatives.length)})
            </h2>
            <div className="results__grid">
              {alternatives.map((sp) => {
                const inCompare = compareSet.has(sp.phone.id);
                return (
                  <PhoneCard
                    key={sp.phone.id}
                    phone={sp.phone}
                    matchScore={sp.matchScore}
                    isFavorite={favoriteSet.has(sp.phone.id)}
                    onToggleFavorite={onToggleFavorite}
                    isInCompare={inCompare}
                    canCompare={compareIds.length < MAX_COMPARE}
                    onToggleCompare={onToggleCompare}
                    onOpenDetails={onOpenDetails}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="results__actions">
          <Button
            variant="secondary"
            size="md"
            startIcon={<Pencil size={16} />}
            onClick={() => onNavigate("quiz")}
          >
            ویرایش پاسخ‌ها
          </Button>
          <Button
            variant="ghost"
            size="md"
            startIcon={<RotateCcw size={16} />}
            onClick={() => {
              onResetPreferences();
              onNavigate("quiz");
            }}
          >
            شروع دوباره
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Sub-components
 * ============================================================ */

interface SummaryItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <div className="results__summary-item">
      <span className="results__summary-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="results__summary-label">{label}:</span>
      <strong className="results__summary-value">{value}</strong>
    </div>
  );
}

interface BestMatchCardProps {
  scored: ScoredPhone;
  isFavorite: boolean;
  isInCompare: boolean;
  canCompare: boolean;
  onToggleFavorite: (phoneId: string) => void;
  onToggleCompare: (phone: Phone) => void;
  onOpenDetails: (phone: Phone) => void;
}

function BestMatchCard({
  scored,
  isFavorite,
  isInCompare,
  canCompare,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetails,
}: BestMatchCardProps) {
  const {
    phone,
    matchScore,
    budgetStatus,
    dataQuality,
    strengths,
    weaknesses,
    matchNotes,
    dataNotes,
  } = scored;

  const brandLabel = PHONE_BRAND_LABELS_FA[phone.brand];
  const priceText =
    phone.priceToman === null
      ? PRICE_UNAVAILABLE_FA
      : formatPrice(phone.priceToman);

  const allNotes = [...matchNotes, ...dataNotes];
  const compareDisabled = !isInCompare && !canCompare;

  return (
    <article className="best-match">
      <div className="best-match__label">
        <Trophy size={14} aria-hidden="true" />
        <span>بهترین تطابق</span>
      </div>

      <div className="best-match__body">
        <div className="best-match__media">
          <PhoneImage
            imagePath={phone.imagePath}
            alt={`${brandLabel} ${phone.model}`}
            brand={phone.brand}
            model={phone.model}
            ratio="square"
            priority
          />
        </div>

        <div className="best-match__content">
          <div className="best-match__header">
            <div className="best-match__identity">
              <span className="best-match__brand">{brandLabel}</span>
              <h2 className="best-match__model latin">{phone.model}</h2>
            </div>
            <button
              type="button"
              className={
                "best-match__favorite" +
                (isFavorite ? " best-match__favorite--active" : "")
              }
              onClick={() => onToggleFavorite(phone.id)}
              aria-pressed={isFavorite}
              aria-label={
                isFavorite
                  ? "حذف از علاقه‌مندی‌ها"
                  : "افزودن به علاقه‌مندی‌ها"
              }
            >
              <Heart
                size={20}
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="best-match__badges">
            <BudgetBadge status={budgetStatus} />
            <DataQualityBadge quality={dataQuality} />
          </div>

          <div className="best-match__score">
            <div className="best-match__score-header">
              <span className="best-match__score-label">امتیاز تطابق</span>
              <span className="best-match__score-value">
                {toPersianDigits(matchScore)}٪
              </span>
            </div>
            <div className="best-match__score-bar">
              <div
                className="best-match__score-fill"
                style={{ width: `${Math.max(0, Math.min(100, matchScore))}%` }}
              />
            </div>
          </div>

          <div className="best-match__price-row">
            <span className="best-match__price-label">قیمت:</span>
            <span
              className={
                "best-match__price" +
                (phone.priceToman === null
                  ? " best-match__price--unknown"
                  : "")
              }
            >
              {priceText}
            </span>
            {phone.priceToman !== null && !phone.priceVerified && (
              <span className="best-match__price-note">
                <Info size={12} aria-hidden="true" />
                <span>قیمت تأیید نشده</span>
              </span>
            )}
          </div>

          {strengths.length > 0 && (
            <div className="best-match__section">
              <h3 className="best-match__section-title">نقاط قوت</h3>
              <ul className="best-match__list best-match__list--success">
                {strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="best-match__section">
              <h3 className="best-match__section-title">نقاط ضعف</h3>
              <ul className="best-match__list best-match__list--warning">
                {weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {allNotes.length > 0 && (
            <div className="best-match__section">
              <h3 className="best-match__section-title">یادداشت</h3>
              <ul className="best-match__list best-match__list--info">
                {allNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="best-match__actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenDetails(phone)}
            >
              مشاهده‌ی جزئیات
            </Button>
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
          </div>
        </div>
      </div>
    </article>
  );
}

function BudgetBadge({ status }: { status: BudgetStatus }) {
  switch (status) {
    case "unlimited":
      return (
        <span className="badge badge--info">
          <Wallet size={12} aria-hidden="true" />
          <span>بدون محدودیت بودجه</span>
        </span>
      );
    case "within":
      return (
        <span className="badge badge--success">
          <Wallet size={12} aria-hidden="true" />
          <span>در بودجه</span>
        </span>
      );
    case "over":
      return (
        <span className="badge badge--error">
          <AlertTriangle size={12} aria-hidden="true" />
          <span>بالاتر از بودجه</span>
        </span>
      );
    case "unknown":
      return (
        <span className="badge badge--warning">
          <Info size={12} aria-hidden="true" />
          <span>قیمت مشخص نیست</span>
        </span>
      );
  }
}

function DataQualityBadge({ quality }: { quality: DataQuality }) {
  if (quality === "complete") return null;
  if (quality === "partial") {
    return (
      <span className="badge badge--warning">
        <Info size={12} aria-hidden="true" />
        <span>داده‌ی ناقص</span>
      </span>
    );
  }
  return (
    <span className="badge badge--error">
      <AlertTriangle size={12} aria-hidden="true" />
      <span>داده‌ی محدود</span>
    </span>
  );
}