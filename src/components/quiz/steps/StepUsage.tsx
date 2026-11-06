import {
  Gamepad2,
  Camera,
  Smartphone,
  GraduationCap,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import StepShell from "./StepShell";
import type { PrimaryUsage, UserPreferences } from "../../../types/preferences";

export interface StepUsageProps {
  preferences: UserPreferences;
  onChange: (partial: Partial<UserPreferences>) => void;
}

interface UsageOption {
  value: PrimaryUsage;
  label: string;
  description: string;
  icon: LucideIcon;
}

const USAGE_OPTIONS: UsageOption[] = [
  {
    value: "gaming",
    label: "بازی",
    description: "کارایی، گرافیک و نرخ فریم بالا",
    icon: Gamepad2,
  },
  {
    value: "photography",
    label: "عکاسی",
    description: "کیفیت دوربین و پردازش تصویر",
    icon: Camera,
  },
  {
    value: "everyday",
    label: "استفاده‌ی روزمره",
    description: "تعادل در همه‌چیز",
    icon: Smartphone,
  },
  {
    value: "studying_work",
    label: "درس و کار",
    description: "باتری، نرم‌افزار و بهره‌وری",
    icon: GraduationCap,
  },
  {
    value: "content_creation",
    label: "تولید محتوا",
    description: "دوربین، نمایشگر و کارایی",
    icon: Clapperboard,
  },
];

export default function StepUsage({ preferences, onChange }: StepUsageProps) {
  return (
    <StepShell
      title="بیشتر برای چه کاری استفاده می‌کنی؟"
      description="کاربرد اصلی، وزن‌های پیش‌فرض الگوریتم را متناسب با نیازت تنظیم می‌کند. در گام بعد می‌توانی این وزن‌ها را دقیق‌تر کنی."
    >
      <div
        role="radiogroup"
        aria-label="نوع استفاده‌ی اصلی"
        className="quiz-options"
      >
        {USAGE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
          const selected = preferences.primaryUsage === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={
                "quiz-option" + (selected ? " quiz-option--selected" : "")
              }
              onClick={() => onChange({ primaryUsage: value })}
            >
              <span className="quiz-option__icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className="quiz-option__content">
                <span className="quiz-option__title">{label}</span>
                <span className="quiz-option__description">{description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}