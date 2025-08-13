import RadioSelect from '../../../components/RadioSelect';
import { Gender, GenderProps } from '../../../types/login';

export default function GenderRadioGroup({
  value,
  onChange,
  error,
}: GenderProps) {
  const options: { label: string; value: Gender }[] = [
    { label: '남성', value: 'MALE' },
    { label: '여성', value: 'FEMALE' },
  ];
  const errorId = 'gender-error';

  return (
    <fieldset
      className='flex flex-col gap-2'
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}>
      <legend className="mb-1.5 pl-1  font-medium text-slate-700">성별</legend>
      <div className="flex items-center gap-2">
        {options.map((opt) => (
          <RadioSelect
            key={opt.value}
            name="gender"
            value={opt.value}
            checkedValue={value}
            onChange={(v) => onChange(v as Gender)}
            label={opt.label}
            size="md"
            className="justify-center"
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
