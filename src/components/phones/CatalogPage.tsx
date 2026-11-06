import { useMemo, useState } from "react";
import { Smartphone, RotateCcw } from "lucide-react";
import PhoneCard from "./PhoneCard";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";
import { PHONES } from "../../data/phones";
import { PHONE_BRAND_LABELS_FA, type Phone, type PhoneBrand } from "../../types/phone";
import { toPersianDigits } from "../../utils/formatPrice";
import type { AppView } from "../../App";
import "./CatalogPage.css";

type BrandFilter = PhoneBrand | "all";

interface BrandFilterOption {
  value: BrandFilter;
  label: string;
}

const BRAND_FILTERS: BrandFilterOption[] = [
  { value: "all", label: "همه" },
  { value: "samsung", label: PHONE_BRAND_LABELS_FA.samsung },
  { value: "xiaomi", label: PHONE_BRAND_LABELS_FA.xiaomi },
  { value: "apple", label: PHONE_BRAND_LABELS_FA.apple },
  { value: "google", label: PHONE_BRAND_LABELS_FA.google },
];

/** حداکثر تعداد گوشی قابل مقایسه — باید با مقدار App.tsx هماهنگ باشد. */
const MAX_COMPARE = 3;

export interface CatalogPageProps {
  favorites: string[];
  compareIds: string[];
  onToggleFavorite: (phoneId: string) => void;
  onToggleCompare: (phone: Phone) => void;
  onOpenDetails: (phone: Phone) => void;
  onNavigate: (view: AppView) => void;
}

export default function CatalogPage({
  favorites,
  compareIds,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetails,
  onNavigate,
}: CatalogPageProps) {
  const [brandFilter, setBrandFilter] = useState<BrandFilter>("all");

  const visiblePhones = useMemo(() => {
    if (brandFilter === "all") return PHONES;
    return PHONES.filter((phone) => phone.brand === brandFilter);
  }, [brandFilter]);

  const favoriteSet = useMemo(
    () => new Set<string>(favorites),
    [favorites],
  );

  const compareSet = useMemo(
    () => new Set<string>(compareIds),
    [compareIds],
  );

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog__inner container">
        <SectionTitle
          eyebrow="کاتالوگ گوشی‌ها"
          title={
            <span id="catalog-title">گوشی‌های موجود در گوشی‌یار</span>
          }
          description="برای آشنایی و مرور سریع، همه‌ی گوشی‌ها را این‌جا ببین. برای پیشنهاد دقیق و شخصی‌سازی‌شده، از پرسش‌نامه شروع کن."
        />

        <div className="catalog__toolbar">
          <div
            className="catalog__filters"
            role="group"
            aria-label="فیلتر بر اساس برند"
          >
            {BRAND_FILTERS.map(({ value, label }) => {
              const isActive = brandFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  className={
                    "catalog__filter" +
                    (isActive ? " catalog__filter--active" : "")
                  }
                  onClick={() => setBrandFilter(value)}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <span className="catalog__count" aria-live="polite">
            {toPersianDigits(visiblePhones.length)} گوشی
          </span>
        </div>

        {visiblePhones.length === 0 ? (
          <EmptyState
            icon={<Smartphone size={28} />}
            title="گوشی‌ای با این فیلتر پیدا نشد"
            description="فیلتر برند را تغییر بده یا از پرسش‌نامه برای پیشنهاد شخصی استفاده کن."
            action={
              <Button
                variant="secondary"
                size="md"
                startIcon={<RotateCcw size={16} />}
                onClick={() => setBrandFilter("all")}
              >
                حذف فیلتر
              </Button>
            }
          />
        ) : (
          <div className="catalog__grid">
            {visiblePhones.map((phone) => {
              const inCompare = compareSet.has(phone.id);
              return (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  isFavorite={favoriteSet.has(phone.id)}
                  onToggleFavorite={onToggleFavorite}
                  isInCompare={inCompare}
                  canCompare={compareIds.length < MAX_COMPARE}
                  onToggleCompare={onToggleCompare}
                  onOpenDetails={onOpenDetails}
                />
              );
            })}
          </div>
        )}

        <div className="catalog__cta">
          <div className="catalog__cta-content">
            <h3 className="catalog__cta-title">
              دنبال گوشی متناسب با خودت هستی؟
            </h3>
            <p className="catalog__cta-description">
              به‌جای مرور همه‌ی گزینه‌ها، از پرسش‌نامه شروع کن تا مناسب‌ترین
              گوشی‌ها بر اساس بودجه و نیازت را ببینی.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate("quiz")}
          >
            شروع پرسش‌نامه
          </Button>
        </div>
      </div>
    </section>
  );
}