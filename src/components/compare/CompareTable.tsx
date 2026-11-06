import {
  X,
  GitCompareArrows,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  BatteryFull,
  Camera,
  Smartphone,
  Info,
  ArrowLeft,
} from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import PhoneImage from "../phones/PhoneImage";
import SectionTitle from "../common/SectionTitle";
import { PHONE_BRAND_LABELS_FA, type Phone } from "../../types/phone";
import {
  formatCompactPrice,
  PRICE_UNAVAILABLE_FA,
  toPersianDigits,
} from "../../utils/formatPrice";
import {
  FEATURE_KEYS,
  FEATURE_LABELS_FA,
} from "../../types/preferences";
import type { AppView } from "../../App";
import "./CompareTable.css";

export interface CompareTableProps {
  phones: Phone[];
  onRemove: (phoneId: string) => void;
  onClear: () => void;
  onOpenDetails: (phone: Phone) => void;
  onNavigate: (view: AppView) => void;
}

interface SpecRow {
  key: string;
  label: string;
  icon: React.ReactNode;
  values: string[];
}

export default function CompareTable({
  phones,
  onRemove,
  onClear,
  onOpenDetails,
  onNavigate,
}: CompareTableProps) {
  if (phones.length === 0) {
    return (
      <section className="compare" aria-labelledby="compare-empty-title">
        <div className="compare__inner container">
          <SectionTitle
            eyebrow="مقایسه"
            title={
              <span id="compare-empty-title">جدول مقایسه خالی است</span>
            }
            description="از کاتالوگ یا نتایج پیشنهاد، تا سه گوشی را انتخاب کن تا در این صفحه کنار هم مقایسه شوند."
            align="center"
          />
          <EmptyState
            icon={<GitCompareArrows size={28} />}
            title="هیچ گوشی‌ای انتخاب نشده"
            description="برای شروع مقایسه، به کاتالوگ برو و با دکمه‌ی «افزودن به مقایسه» گوشی‌های مورد نظرت را اضافه کن."
            action={
              <Button
                variant="primary"
                size="md"
                endIcon={<ArrowLeft size={16} />}
                onClick={() => onNavigate("catalog")}
              >
                رفتن به کاتالوگ
              </Button>
            }
          />
        </div>
      </section>
    );
  }

  const specRows: SpecRow[] = [
    {
      key: "display",
      label: "نمایشگر",
      icon: <Monitor size={14} />,
      values: phones.map((p) => formatDisplay(p)),
    },
    {
      key: "processor",
      label: "پردازنده",
      icon: <Cpu size={14} />,
      values: phones.map((p) => p.specs.processor ?? "ثبت نشده"),
    },
    {
      key: "ram",
      label: "رم",
      icon: <MemoryStick size={14} />,
      values: phones.map((p) =>
        p.specs.ramGb !== null
          ? `${toPersianDigits(p.specs.ramGb)} گیگابایت`
          : "ثبت نشده",
      ),
    },
    {
      key: "storage",
      label: "حافظه",
      icon: <HardDrive size={14} />,
      values: phones.map((p) =>
        p.specs.storageGb !== null
          ? `${toPersianDigits(p.specs.storageGb)} گیگابایت`
          : "ثبت نشده",
      ),
    },
    {
      key: "battery",
      label: "باتری",
      icon: <BatteryFull size={14} />,
      values: phones.map((p) =>
        p.specs.batteryMah !== null
          ? `${toPersianDigits(p.specs.batteryMah)} mAh`
          : "ثبت نشده",
      ),
    },
    {
      key: "camera",
      label: "دوربین",
      icon: <Camera size={14} />,
      values: phones.map(
        (p) =>
          p.specs.camera.summaryFa ??
          (p.specs.camera.mainMp !== null
            ? `${toPersianDigits(p.specs.camera.mainMp)} مگاپیکسل`
            : "ثبت نشده"),
      ),
    },
    {
      key: "os",
      label: "نرم‌افزار",
      icon: <Smartphone size={14} />,
      values: phones.map((p) => p.specs.os ?? "ثبت نشده"),
    },
  ];

  return (
    <section className="compare" aria-labelledby="compare-title">
      <div className="compare__inner container">
        <SectionTitle
          eyebrow="مقایسه"
          title={<span id="compare-title">گوشی‌ها را کنار هم ببین</span>}
          description="مشخصات، امتیاز ویژگی‌ها و قیمت را در یک نگاه مقایسه کن. بالاترین امتیاز در هر ردیف با رنگ سبز مشخص شده."
        />

        <div className="compare__actions-top">
          <button
            type="button"
            className="compare__clear"
            onClick={onClear}
          >
            <X size={14} aria-hidden="true" />
            <span>پاک کردن همه</span>
          </button>
        </div>

        <div
          className="compare__scroll"
          role="region"
          aria-label="جدول مقایسه‌ی گوشی‌ها"
          tabIndex={0}
        >
          <table
            className="compare-table"
            style={{ ["--cols" as string]: phones.length }}
          >
            <colgroup>
              <col className="compare-table__col-label" />
              {phones.map((p) => (
                <col key={p.id} />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th scope="col" className="compare-table__corner">
                  <span className="sr-only">ویژگی</span>
                </th>
                {phones.map((phone) => {
                  const brandLabel = PHONE_BRAND_LABELS_FA[phone.brand];
                  return (
                    <th
                      key={phone.id}
                      scope="col"
                      className="compare-table__phone-head"
                    >
                      <div className="compare-table__phone-head-inner">
                        <button
                          type="button"
                          className="compare-table__phone-remove"
                          onClick={() => onRemove(phone.id)}
                          aria-label={`حذف ${brandLabel} ${phone.model} از مقایسه`}
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="compare-table__phone-open"
                          onClick={() => onOpenDetails(phone)}
                          aria-label={`مشاهده‌ی جزئیات ${brandLabel} ${phone.model}`}
                        >
                          <span className="compare-table__phone-image">
                            <PhoneImage
                              imagePath={phone.imagePath}
                              alt={`${brandLabel} ${phone.model}`}
                              brand={phone.brand}
                              model={phone.model}
                              ratio="square"
                            />
                          </span>
                          <span className="compare-table__phone-brand">
                            {brandLabel}
                          </span>
                          <span className="compare-table__phone-model latin">
                            {phone.model}
                          </span>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <tr className="compare-table__section-row">
                <th
                  scope="colgroup"
                  colSpan={phones.length + 1}
                  className="compare-table__section-title"
                >
                  مشخصات فنی
                </th>
              </tr>
              {specRows.map((row) => (
                <tr key={row.key} className="compare-table__spec-row">
                  <th scope="row" className="compare-table__row-label">
                    <span aria-hidden="true">{row.icon}</span>
                    <span>{row.label}</span>
                  </th>
                  {row.values.map((value, i) => {
                    const phone = phones[i]!;
                    const isUnknown = value === "ثبت نشده";
                    return (
                      <td
                        key={phone.id + row.key}
                        className={
                          "compare-table__cell" +
                          (isUnknown
                            ? " compare-table__cell--unknown"
                            : "")
                        }
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="compare-table__section-row">
                <th
                  scope="colgroup"
                  colSpan={phones.length + 1}
                  className="compare-table__section-title"
                >
                  امتیاز ویژگی‌ها (از ۱۰)
                </th>
              </tr>
              {FEATURE_KEYS.map((key) => {
                const values = phones.map((p) => p.scores[key]);
                const maxValue = Math.max(
                  ...values.filter((v): v is number => v !== null),
                );
                const hasValidMax = Number.isFinite(maxValue);
                return (
                  <tr key={key} className="compare-table__score-row">
                    <th scope="row" className="compare-table__row-label">
                      {FEATURE_LABELS_FA[key]}
                    </th>
                    {values.map((value, i) => {
                      const phone = phones[i]!;
                      const isBest =
                        value !== null &&
                        hasValidMax &&
                        value === maxValue &&
                        values.filter((v) => v === maxValue).length === 1;
                      return (
                        <td
                          key={phone.id + key}
                          className={
                            "compare-table__cell compare-table__cell--score" +
                            (value === null
                              ? " compare-table__cell--unknown"
                              : "") +
                            (isBest ? " compare-table__cell--best" : "")
                          }
                        >
                          {value === null ? (
                            <span className="compare-table__unknown">
                              <Info size={12} aria-hidden="true" />
                              <span>امتیازدهی نشده</span>
                            </span>
                          ) : (
                            <ScoreCell value={value} isBest={isBest} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              <tr className="compare-table__section-row">
                <th
                  scope="colgroup"
                  colSpan={phones.length + 1}
                  className="compare-table__section-title"
                >
                  قیمت
                </th>
              </tr>
              <tr className="compare-table__price-row">
                <th scope="row" className="compare-table__row-label">
                  قیمت
                </th>
                {phones.map((phone) => {
                  const unknown = phone.priceToman === null;
                  return (
                    <td
                      key={phone.id + "-price"}
                      className={
                        "compare-table__cell compare-table__cell--price" +
                        (unknown
                          ? " compare-table__cell--unknown"
                          : "")
                      }
                    >
                      <span className="compare-table__price-value">
                        {unknown
                          ? PRICE_UNAVAILABLE_FA
                          : formatCompactPrice(phone.priceToman)}
                      </span>
                      {!unknown && !phone.priceVerified && (
                        <span className="compare-table__price-note">
                          <Info size={11} aria-hidden="true" />
                          <span>تأیید نشده</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="compare__actions-bottom">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate("catalog")}
          >
            افزودن گوشی دیگر
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => onNavigate("results")}
          >
            بازگشت به نتایج
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ScoreCellProps {
  value: number;
  isBest: boolean;
}

function ScoreCell({ value, isBest }: ScoreCellProps) {
  return (
    <span
      className={
        "compare-table__score" + (isBest ? " compare-table__score--best" : "")
      }
    >
      <span className="compare-table__score-bar" aria-hidden="true">
        <span
          className="compare-table__score-fill"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </span>
      <span className="compare-table__score-value">
        {toPersianDigits(value)}
      </span>
    </span>
  );
}

function formatDisplay(phone: Phone): string {
  const d = phone.specs.display;
  const parts: string[] = [];
  if (d.sizeInch !== null) parts.push(`${toPersianDigits(d.sizeInch)}"`);
  if (d.technology) parts.push(d.technology);
  if (d.refreshRateHz !== null)
    parts.push(`${toPersianDigits(d.refreshRateHz)}Hz`);
  return parts.length > 0 ? parts.join(" • ") : "ثبت نشده";
}