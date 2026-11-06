import { useEffect, useId, useRef } from "react";
import {
  X,
  Info,
  ShieldAlert,
  ShieldCheck,
  CircleDollarSign,
  Cpu,
  MemoryStick,
  HardDrive,
  BatteryFull,
  Monitor,
  Camera,
  Smartphone,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import PhoneImage from "./PhoneImage";
import { PHONE_BRAND_LABELS_FA, type Phone } from "../../types/phone";
import {
  formatPrice,
  PRICE_UNAVAILABLE_FA,
  toPersianDigits,
} from "../../utils/formatPrice";
import {
  FEATURE_KEYS,
  FEATURE_LABELS_FA,
} from "../../types/preferences";
import "./PhoneDetailsModal.css";

export interface PhoneDetailsModalProps {
  phone: Phone;
  onClose: () => void;
}

/** فوکوس‌پذیرها برای focus trap ساده. */
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function PhoneDetailsModal({
  phone,
  onClose,
}: PhoneDetailsModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  // Escape برای بستن + focus trap با Tab
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // فوکوس اولیه روی دکمه‌ی بستن
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // قفل اسکرول body
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // کلیک روی backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const brandLabel = PHONE_BRAND_LABELS_FA[phone.brand];
  const priceText =
    phone.priceToman === null
      ? PRICE_UNAVAILABLE_FA
      : formatPrice(phone.priceToman);

  const { specs, scores } = phone;

  return (
    <div
      className="phone-modal-backdrop"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="phone-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header */}
        <div className="phone-modal__header">
          <div className="phone-modal__title-block">
            <span className="phone-modal__brand">{brandLabel}</span>
            <h2 className="phone-modal__title latin" id={titleId}>
              {phone.model}
            </h2>
          </div>
          <button
            type="button"
            className="phone-modal__close"
            onClick={onClose}
            aria-label="بستن پنجره‌ی جزئیات"
            ref={closeButtonRef}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="phone-modal__body">
          {/* Media + Price */}
          <div className="phone-modal__media-col">
            <PhoneImage
              imagePath={phone.imagePath}
              alt={`${brandLabel} ${phone.model}`}
              brand={phone.brand}
              model={phone.model}
              ratio="square"
              priority
            />

            <div className="phone-modal__price-block">
              <span className="phone-modal__price-label">قیمت</span>
              <span
                className={
                  "phone-modal__price" +
                  (phone.priceToman === null
                    ? " phone-modal__price--unknown"
                    : "")
                }
              >
                {priceText}
              </span>
              <div className="phone-modal__price-badges">
                {phone.priceToman === null && (
                  <span className="badge badge--warning">
                    <Info size={12} aria-hidden="true" />
                    <span>قیمت ثبت نشده</span>
                  </span>
                )}
                {phone.priceToman !== null && phone.priceVerified && (
                  <span className="badge badge--success">
                    <ShieldCheck size={12} aria-hidden="true" />
                    <span>قیمت تأییدشده</span>
                  </span>
                )}
                {phone.priceToman !== null && !phone.priceVerified && (
                  <span className="badge badge--warning">
                    <Info size={12} aria-hidden="true" />
                    <span>قیمت تأیید نشده</span>
                  </span>
                )}
              </div>
            </div>

            <div className="phone-modal__data-status">
              {phone.isDemo ? (
                <span className="badge badge--warning">
                  <ShieldAlert size={12} aria-hidden="true" />
                  <span>داده‌ی دمو (تست رابط)</span>
                </span>
              ) : (
                <span className="badge badge--success">
                  <ShieldCheck size={12} aria-hidden="true" />
                  <span>داده‌ی ثبت‌شده</span>
                </span>
              )}
            </div>
          </div>

          {/* Info columns */}
          <div className="phone-modal__info-col">
            {/* Scores */}
            <section className="phone-modal__section">
              <h3 className="phone-modal__section-title">
                <CircleDollarSign size={16} aria-hidden="true" />
                <span>امتیاز ویژگی‌ها</span>
              </h3>
              <ul className="phone-modal__scores">
                {FEATURE_KEYS.map((key) => {
                  const value = scores[key];
                  return (
                    <li key={key} className="phone-modal__score-row">
                      <span className="phone-modal__score-label">
                        {FEATURE_LABELS_FA[key]}
                      </span>
                      {value === null ? (
                        <span className="phone-modal__score-null">
                          امتیازدهی نشده
                        </span>
                      ) : (
                        <>
                          <div className="phone-modal__score-bar">
                            <div
                              className="phone-modal__score-fill"
                              style={{ width: `${(value / 10) * 100}%` }}
                            />
                          </div>
                          <span className="phone-modal__score-value">
                            {toPersianDigits(value)} / ۱۰
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Specs */}
            <section className="phone-modal__section">
              <h3 className="phone-modal__section-title">
                <Smartphone size={16} aria-hidden="true" />
                <span>مشخصات فنی</span>
              </h3>
              <dl className="phone-modal__specs">
                <SpecRow
                  icon={<Monitor size={14} />}
                  label="نمایشگر"
                  value={formatDisplay(specs.display)}
                />
                <SpecRow
                  icon={<Cpu size={14} />}
                  label="پردازنده"
                  value={specs.processor}
                />
                <SpecRow
                  icon={<MemoryStick size={14} />}
                  label="رم"
                  value={
                    specs.ramGb !== null
                      ? `${toPersianDigits(specs.ramGb)} گیگابایت`
                      : null
                  }
                />
                <SpecRow
                  icon={<HardDrive size={14} />}
                  label="حافظه"
                  value={
                    specs.storageGb !== null
                      ? `${toPersianDigits(specs.storageGb)} گیگابایت`
                      : null
                  }
                />
                <SpecRow
                  icon={<BatteryFull size={14} />}
                  label="باتری"
                  value={
                    specs.batteryMah !== null
                      ? `${toPersianDigits(specs.batteryMah)} میلی‌آمپر ساعت`
                      : null
                  }
                />
                <SpecRow
                  icon={<Camera size={14} />}
                  label="دوربین"
                  value={
                    specs.camera.summaryFa ??
                    (specs.camera.mainMp !== null
                      ? `دوربین اصلی ${toPersianDigits(specs.camera.mainMp)} مگاپیکسل`
                      : null)
                  }
                />
                <SpecRow
                  icon={<Smartphone size={14} />}
                  label="نرم‌افزار"
                  value={specs.os}
                  latin
                />
              </dl>
            </section>

            {/* Adv/Disadv */}
            <div className="phone-modal__lists">
              {phone.advantages.length > 0 && (
                <section className="phone-modal__section">
                  <h3 className="phone-modal__section-title">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>مزایا</span>
                  </h3>
                  <ul className="phone-modal__list phone-modal__list--success">
                    {phone.advantages.map((adv) => (
                      <li key={adv}>{adv}</li>
                    ))}
                  </ul>
                </section>
              )}

              {phone.disadvantages.length > 0 && (
                <section className="phone-modal__section">
                  <h3 className="phone-modal__section-title">
                    <XCircle size={16} aria-hidden="true" />
                    <span>معایب</span>
                  </h3>
                  <ul className="phone-modal__list phone-modal__list--warning">
                    {phone.disadvantages.map((dis) => (
                      <li key={dis}>{dis}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

interface SpecRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  latin?: boolean;
}

function SpecRow({ icon, label, value, latin = false }: SpecRowProps) {
  return (
    <div className="phone-modal__spec-row">
      <dt className="phone-modal__spec-label">
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>
      </dt>
      <dd
        className={
          "phone-modal__spec-value" +
          (value === null ? " phone-modal__spec-value--unknown" : "") +
          (latin && value !== null ? " latin" : "")
        }
      >
        {value ?? "ثبت نشده"}
      </dd>
    </div>
  );
}

function formatDisplay(display: Phone["specs"]["display"]): string | null {
  const parts: string[] = [];
  if (display.sizeInch !== null) {
    parts.push(`${toPersianDigits(display.sizeInch)} اینچ`);
  }
  if (display.technology) {
    parts.push(display.technology);
  }
  if (display.refreshRateHz !== null) {
    parts.push(`${toPersianDigits(display.refreshRateHz)} هرتز`);
  }
  return parts.length > 0 ? parts.join(" • ") : null;
}