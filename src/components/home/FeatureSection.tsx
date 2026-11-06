import {
  Wallet,
  Sparkles,
  SlidersHorizontal,
  BadgeCheck,
  GitCompareArrows,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import type { AppView } from "../../App";
import "./FeatureSection.css";

export interface FeatureSectionProps {
  onNavigate: (view: AppView) => void;
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: Wallet,
    title: "بودجه‌ات را مشخص کن",
    description:
      "بگو چقدر می‌خواهی هزینه کنی. گوشی‌های در بودجه را جدا نشان می‌دهیم و هرگز قیمت نامشخص را «در بودجه» حساب نمی‌کنیم.",
  },
  {
    icon: Sparkles,
    title: "سبک استفاده‌ات را بگو",
    description:
      "بازی، عکاسی، درس و کار یا استفاده‌ی روزمره؟ الگوریتم وزن‌های پیش‌فرض را بر اساس نیازت تنظیم می‌کند.",
  },
  {
    icon: SlidersHorizontal,
    title: "اولویت‌ها را رتبه‌بندی کن",
    description:
      "دوربین مهم‌تر است یا باتری؟ به هر ویژگی از ۱ تا ۱۰ امتیاز بده تا پیشنهاد دقیقاً به سلیقه‌ات نزدیک شود.",
  },
  {
    icon: BadgeCheck,
    title: "پیشنهاد شفاف بگیر",
    description:
      "هر پیشنهاد توضیح می‌دهد چرا انتخاب شده و کجا ضعف دارد. هیچ امتیاز پنهان یا توضیح ساختگی وجود ندارد.",
  },
];

export default function FeatureSection({ onNavigate }: FeatureSectionProps) {
  return (
    <section className="features" aria-labelledby="features-title">
      <div className="features__inner container">
        <SectionTitle
          eyebrow="چطور کار می‌کند"
          title={<span id="features-title">چهار گام تا گوشی مناسب</span>}
          description="بدون سردرگمی و جست‌وجوی بی‌پایان. کافی است نیازت را بگویی؛ گوشی‌یار بقیه را انجام می‌دهد."
          align="center"
        />

        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <article className="features__card" key={title}>
              <div className="features__card-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={2} />
              </div>
              <div className="features__card-step" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="features__card-title">{title}</h3>
              <p className="features__card-description">{description}</p>
            </article>
          ))}
        </div>

        {/* معرفی مقایسه */}
        <div className="features__cta">
          <div className="features__cta-content">
            <span className="features__cta-eyebrow">
              <GitCompareArrows size={16} aria-hidden="true" />
              <span>ابزار مقایسه</span>
            </span>
            <h3 className="features__cta-title">تا سه گوشی را کنار هم ببین</h3>
            <p className="features__cta-description">
              مشخصات فنی، امتیازها، قیمت و مزایا و معایب را در یک جدول شفاف
              مقایسه کن و آگاهانه تصمیم بگیر.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            endIcon={<ArrowLeft size={18} />}
            onClick={() => onNavigate("compare")}
          >
            شروع مقایسه
          </Button>
        </div>
      </div>
    </section>
  );
}