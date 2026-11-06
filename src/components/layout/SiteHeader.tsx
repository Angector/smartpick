import { useEffect, useState } from "react";
import { Menu, X, Smartphone } from "lucide-react";
import Button from "../common/Button";
import type { AppView } from "../../App";
import "./SiteHeader.css";

export interface SiteHeaderProps {
  /** نمای فعلی برای برجسته کردن آیتم منو */
  activeView: AppView;
  /** تابع ناوبری که App تأمین می‌کند */
  onNavigate: (view: AppView) => void;
}

interface NavItem {
  view: AppView;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: "home", label: "خانه" },
  { view: "quiz", label: "انتخاب گوشی" },
  { view: "compare", label: "مقایسه" },
];

/**
 * هدر سایت — برند + ناوبری واکنش‌گرا.
 * - در دسکتاپ: لینک‌های افقی
 * - در موبایل: دکمه‌ی همبرگری با dropdown
 * - CTA همیشه دیده می‌شود
 */
export default function SiteHeader({ activeView, onNavigate }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // با تغییر view، منوی موبایل بسته شود
  useEffect(() => {
    setMobileOpen(false);
  }, [activeView]);

  // بستن منو با Esc
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        {/* برند */}
        <button
          type="button"
          className="site-header__brand"
          onClick={() => handleNav("home")}
          aria-label="گوشی‌یار — بازگشت به خانه"
        >
          <span className="site-header__brand-icon" aria-hidden="true">
            <Smartphone size={22} strokeWidth={2.2} />
          </span>
          <span className="site-header__brand-text">
            <span className="site-header__brand-fa">گوشی‌یار</span>
            <span className="site-header__brand-en latin">SmartPick</span>
          </span>
        </button>

        {/* ناوبری دسکتاپ */}
        <nav
          className="site-header__nav"
          aria-label="ناوبری اصلی"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              type="button"
              className={
                "site-header__nav-link" +
                (activeView === item.view ? " site-header__nav-link--active" : "")
              }
              onClick={() => handleNav(item.view)}
              aria-current={activeView === item.view ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA + دکمه‌ی موبایل */}
        <div className="site-header__actions">
          <Button
            variant="primary"
            size="sm"
            className="site-header__cta"
            onClick={() => handleNav("quiz")}
          >
            شروع انتخاب
          </Button>

          <button
            type="button"
            className="site-header__menu-toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="site-header-mobile-menu"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      {mobileOpen && (
        <div
          id="site-header-mobile-menu"
          className="site-header__mobile"
          role="dialog"
          aria-label="منوی ناوبری"
        >
          <nav className="site-header__mobile-nav" aria-label="ناوبری موبایل">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.view}
                type="button"
                className={
                  "site-header__mobile-link" +
                  (activeView === item.view
                    ? " site-header__mobile-link--active"
                    : "")
                }
                onClick={() => handleNav(item.view)}
                aria-current={activeView === item.view ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}