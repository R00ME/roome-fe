
type Gender = "MALE" | "FEMALE";
interface GenderProps {
  value: Gender | "";
  onChange: (g: Gender) => void;
  error?: string;
}

export interface SaveExtraInfoPayload {
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
}
interface BirthProps {
  year: string;
  month: string;
  day: string;
  onChange: (next: { year?: string; month?: string; day?: string }) => void;
  error?: string;
}