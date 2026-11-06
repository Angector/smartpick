import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Camera,
  BatteryFull,
  BadgeCheck,
} from "lucide-react";
import Button from "../common/Button";
import type { AppView } from "../../App";
import "./HeroSection.css";

export interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        {/* ---------- محتوا ---------- */}
        <div className="hero__content">
          <span className="hero__eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            <span>انتخاب هوشمندانه، بدون حدس و گمان</span>
          </span>

          <h1 className="hero__title" id="hero-title">
            گوشی مناسب <span className="hero__title-accent">تو</span>،
            <br />
            با انتخابی هوشمندانه.
          </h1>

          <p className="hero__description">
            به چند سؤال ساده درباره‌ی بودجه، سبک استفاده و اولویت‌هایت پاسخ
            بده تا گوشی‌هایی که واقعاً به کارت می‌آیند را پیدا کنی. بدون
            تبلیغ، بدون سوگیری، فقط گزینه‌های شفاف.
          </p>

          <div className="hero__ctas">
            <Button
              variant="primary"
              size="lg"
              endIcon={<ArrowLeft size={18} />}
              onClick={() => onNavigate("quiz")}
            >
              انتخاب گوشی من
            </Button>
            <Button
              variant="onDark"
              size="lg"
              onClick={() => onNavigate("catalog")}
            >
              مشاهده گوشی‌ها
            </Button>
          </div>

          <ul className="hero__meta" aria-label="ویژگی‌های کلیدی">
            <li>
              <ShieldCheck size={16} aria-hidden="true" />
              <span>الگوریتم شفاف و قابل بررسی</span>
            </li>
            <li>
              <Zap size={16} aria-hidden="true" />
              <span>بدون نیاز به ثبت‌نام</span>
            </li>
            <li>
              <BadgeCheck size={16} aria-hidden="true" />
              <span>کاملاً رایگان</span>
            </li>
          </ul>
        </div>

        {/* ---------- ویژوال تزئینی ---------- */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__preview-card">
            <div className="hero__preview-header">
              <span className="hero__preview-eyebrow">پیشنهاد گوشی‌یار</span>
              <span className="hero__preview-score">۹۲٪</span>
            </div>
            <div className="hero__preview-phone latin">Galaxy S24 Ultra</div>
            <div className="hero__preview-bar">
              <div className="hero__preview-bar-fill" />
            </div>
            <div className="hero__preview-meta">
              <span>دوربین ۱۰/۱۰</span>
              <span>در بودجه</span>
            </div>
          </div>

          <div className="hero__float-chip hero__float-chip--1">
            <Camera size={14} />
            <span>دوربین عالی</span>
          </div>
          <div className="hero__float-chip hero__float-chip--2">
            <BatteryFull size={14} />
            <span>باتری بادوام</span>
          </div>
        </div>
      </div>
    </section>
  );
}