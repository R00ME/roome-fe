import { useEffect, useMemo, useRef, useState } from 'react';
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

  const [yearInput, setYearInput] = useState<string>(year ?? '');
  const [monthInput, setMonthInput] = useState<string>(month ?? '');
  const [dayInput, setDayInput] = useState<string>(day ?? '');

  const yNum = Number(yearInput);
  const mNum = Number(monthInput);

  const maxDay = useMemo(() => {
    if (!yNum || !mNum) return 31;
    return daysInMonth(yNum, mNum);
  }, [yNum, mNum]);

  const onlyDigits = (v: string, maxLen: number) =>
    v.replace(/\D/g, '').slice(0, maxLen);

  // 연도
  const onYearChange = (v: string) => {
    setYearInput(onlyDigits(v, 4));
  };

  const onYearBlur = () => {
    const n = Number(yearInput);
    if (!yearInput || !n) {
      setYearInput('');
      onChange({ year: '' });
      return;
    }
    const padded = String(n).padStart(4, '0');
    setYearInput(padded);
    onChange({ year: padded });
  };

  // 월
  const onMonthChange = (v: string) => {
    const digitsOnly = onlyDigits(v, 2);
    const num = Number(digitsOnly);

    if (digitsOnly === '' || (num >= 1 && num <= 12)) {
      setMonthInput(digitsOnly);
    }
  };

  const onMonthBlur = () => {
    if (!monthInput) {
      setMonthInput('');
      onChange({ month: '' });
      return;
    }
    let n = Number(monthInput);
    if (!n) {
      setMonthInput('');
      onChange({ month: '' });
      return;
    }

    n = Math.max(1, Math.min(12, n));
    const padded = String(n).padStart(2, '0');
    setMonthInput(padded);
    onChange({ month: padded });
  };

  // 일
  const onDayChange = (v: string) => {
    const digitsOnly = onlyDigits(v, 2);
    const num = Number(digitsOnly);
    const currentMaxDay = maxDay || 31;

    if (digitsOnly === '' || (num >= 1 && num <= currentMaxDay)) {
      setDayInput(digitsOnly);
    }
  };
  const onDayBlur = () => {
    if (!dayInput) {
      setDayInput('');
      onChange({ day: '' });
      return;
    }

    let n = Number(dayInput);
    if (!n) {
      setDayInput('');
      onChange({ day: '' });
      return;
    }

    const limit = maxDay || 31;
    n = Math.max(1, Math.min(limit, n));
    const padded = String(n).padStart(2, '0');
    setDayInput(padded);
    onChange({ day: padded });
  };

  useEffect(() => {
    const d = Number(dayInput);
    if (d && d > maxDay) {
      const padded = String(maxDay).padStart(2, '0');
      setDayInput(padded);
      onChange({ day: padded });
    }
  }, [maxDay]); 

  const errorId = 'birth-error';

  return (
    <fieldset
      className='flex flex-col gap-2'
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}>
      <legend className='mb-1.5 pl-1 font-medium text-slate-700'>
        생년월일
      </legend>
      <section className='flex gap-3'>
        <section className='flex flex-col gap-1 w-[110px]'>
          <input
            ref={yearRef}
            type='text'
            inputMode='numeric'
            pattern='\d{4}'
            placeholder='ex) 1999'
            value={yearInput}
            onChange={(e) => onYearChange(e.target.value)}
            onBlur={onYearBlur}
            className='py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full'
          />
        </section>
        {/* 월 */}
        <section className='flex flex-col gap-1 w-[90px]'>
          <input
            ref={monthRef}
            type='text'
            inputMode='numeric'
            pattern='\d{1,2}'
            placeholder='월'
            value={monthInput}
            onChange={(e) => onMonthChange(e.target.value)}
            onBlur={onMonthBlur}
            className='py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full'
          />
        </section>

        {/* 일 */}
        <section className='flex flex-col gap-1 w-[90px]'>
          <input
            ref={dayRef}
            type='text'
            inputMode='numeric'
            pattern='\d{1,2}'
            placeholder='일'
            value={dayInput}
            onChange={(e) => onDayChange(e.target.value)}
            onBlur={onDayBlur}
            className='py-2 px-3 border bg-white/50 placeholder:text-[#bebebe] border-[#223c6b] rounded-md w-full'
          />
        </section>
      </section>
      {error && <p className='text-xs text-rose-600'>{error}</p>}
    </fieldset>
  );
}
