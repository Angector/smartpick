import { Smartphone, Heart } from "lucide-react";
import type { AppView } from "../../App";
import "./SiteFooter.css";

export interface SiteFooterProps {
  onNavigate: (view: AppView) => void;
}

export default function SiteFooter({ onNavigate }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__grid">
          {/* برند + توضیح */}
          <div className="site-footer__brand-col">
            <div className="site-footer__brand">
              <span className="site-footer__brand-icon" aria-hidden="true">
                <Smartphone size={20} strokeWidth={2.2} />
              </span>
              <div className="site-footer__brand-text">
                <span className="site-footer__brand-fa">گوشی‌یار</span>
                <span className="site-footer__brand-en latin">SmartPick</span>
              </div>
            </div>
            <p className="site-footer__tagline">
              گوشی مناسب تو، با انتخابی هوشمندانه.
            </p>
            <p className="site-footer__disclaimer">
              گوشی‌یار فروشگاه نیست؛ ابزاری برای انتخاب و مقایسه‌ی گوشی
              بر اساس نیاز و بودجه‌ی شماست.
            </p>
          </div>

          {/* ناوبری */}
          <nav
            className="site-footer__col"
            aria-label="لینک‌های سایت"
          >
            <h3 className="site-footer__heading">دسترسی سریع</h3>
            <ul className="site-footer__list">
              <li>
                <button
                  type="button"
                  className="site-footer__link"
                  onClick={() => onNavigate("home")}
                >
                  خانه
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="site-footer__link"
                  onClick={() => onNavigate("quiz")}
                >
                  انتخاب گوشی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="site-footer__link"
                  onClick={() => onNavigate("compare")}
                >
                  مقایسه
                </button>
              </li>
            </ul>
          </nav>

          {/* درباره */}
          <div className="site-footer__col">
            <h3 className="site-footer__heading">درباره‌ی پروژه</h3>
            <p className="site-footer__about">
              SmartPick یک نمونه‌ی فرانت‌اند است که با React و TypeScript
              ساخته شده و بدون بک‌اند کار می‌کند.
            </p>
            <p className="site-footer__demo-note">
              داده‌های فعلی demo هستند و قیمت‌ها واقعی نیستند.
            </p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {year} گوشی‌یار — تمام حقوق محفوظ است.</span>
          <span className="site-footer__made">
            ساخته‌شده با <Heart size={14} aria-label="علاقه" className="site-footer__heart" /> در ایران
          </span>
        </div>
      </div>
    </footer>
  );
}