import { useEffect, useMemo, useRef } from 'react';
import { BirthProps } from '../../../types/login';

function daysInMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0).getDate();
}

export default function BirthSelect({
  year,
  month,
  day,
  onChange,
  error,
}: BirthProps) {
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const yNum = Number(year);
  const mNum = Number(month);

  const maxDay = useMemo(() => {
    if (!yNum || !mNum) return 31;
    return daysInMonth(yNum, mNum);
  }, [yNum, mNum]);

  const onlyDigits = (v: string, maxLen: number) => v.replace(/\D/g, '').slice(0, maxLen);

  // 연도
  const onYearChange = (v: string) => {
    const next = onlyDigits(v, 4);
    onChange({ year: next });     
    if (next.length === 4) {
      monthRef.current?.focus();
    }
  };

  // 월
  const onMonthChange = (v: string) => {
    const next = onlyDigits(v, 2);
    onChange({ month: next });              
    if (next.length === 2) {
      dayRef.current?.focus();
    }
  };
  
  const onMonthBlur = () => {
    if (!month) return;
    let n = Number(month);
    if (!n) return onChange({ month: '' });
    n = Math.max(1, Math.min(12, n));
    onChange({ month: String(n).padStart(2, '0') });
  };

  // 일
  const onDayChange = (v: string) => {
    const next = onlyDigits(v, 2);
    onChange({ day: next });
  };
  const onDayBlur = () => {
    if (!day) return;
    let n = Number(day);
    if (!n) return onChange({ day: '' });
    const limit = maxDay || 31;
    n = Math.max(1, Math.min(limit, n));
    onChange({ day: String(n).padStart(2, '0') });
  };

  useEffect(() => {
    const d = Number(day);
    if (d && d > maxDay) onChange({ day: String(maxDay).padStart(2, '0') });
  }, [maxDay]);

  const errorId = 'birth-error';

  return (
    <fieldset className="flex flex-col gap-2"
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}>
      <legend className='mb-1.5 pl-1 font-medium text-slate-700'>생년월일</legend>
      <section className='flex gap-3'>
          <section className="flex flex-col gap-1 w-[110px]">
          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            pattern="\d{4}"
            placeholder="ex) 1999"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full"
          />
        </section>
          {/* 월 */}
        <section className="flex flex-col gap-1 w-[90px]">
          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            pattern="\d{1,2}"
            placeholder="월"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            onBlur={onMonthBlur}
            className="py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full"
          />
        </section>

        {/* 일 */}
        <section className="flex flex-col gap-1 w-[90px]">
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            pattern="\d{1,2}"
            placeholder="일"
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
            onBlur={onDayBlur}
            className="py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full"
          />
        </section>
        </section>
      {error && <p className='text-xs text-rose-600'>{error}</p>}
    </fieldset>
  );
}
