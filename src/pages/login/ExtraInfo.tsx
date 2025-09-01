import { motion } from 'framer-motion';
import { useState } from 'react';
import LayeredButton from '../../components/LayeredButton';
import ModalBackground from '../../components/ModalBackground';
import { Gender } from '../../types/login';
import BirthSelect from './components/BirthSelect';
import GenderRadioGroup from './components/GenderRadioGroup';
import { saveExtraInfoAPI } from '../../apis/profile';
import { useUserStore } from '../../store/useUserStore';
import { useToastStore } from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';

export default function ExtraInfo() {
  const [gender, setGender] = useState<Gender | ''>('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ gender?: string; birth?: string }>({});
  const {user} = useUserStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const isValid = !!gender && !!year && !!month && !!day; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!gender) newErrors.gender = '성별을 선택해주세요.';
    if (!(year && month && day)) newErrors.birth = '생년월일을 선택해주세요.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const birthDate = `${year}-${month}-${day}`;
    try {
      setLoading(true);
      await saveExtraInfoAPI(user.userId, {
        gender: gender as Gender,
        birthDate,
      });
      navigate('/')
    } catch (error) {
      showToast('저장에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBackground>
      <motion.div
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100vh', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18 }}
        className='fixed inset-0 z-10 flex items-center justify-center'>
        <div className='@container relative sm:w-100 sm:h-110 w-90'>
          {/* 뒤 배경 */}
          <div
            className='absolute w-full h-full bg-[#73A1F7] rounded-4xl border-2 border-[#2656CD]'
            style={{ bottom: '-20px', left: '0' }}
          />
          {/* 메인 배경 */}
          <section className='relative flex flex-col items-center justify-between w-full h-full bg-[#FCF7FD] rounded-4xl border-2 border-[#2656CD] p-13'>
            <h1 className='font-semibold text-xl text-[#2b4982] text-center'>
              더 좋은 경험을 위해 <br /> 몇 가지 정보를 입력해주세요.
            </h1>
            <form
              onSubmit={handleSubmit}
              className='flex flex-col gap-6 pb-3'>
              <GenderRadioGroup
                value={gender}
                onChange={setGender}
                error={errors.gender}
              />
              <BirthSelect
                year={year}
                month={month}
                day={day}
                onChange={(next) => {
                  if (next.year !== undefined) setYear(next.year);
                  if (next.month !== undefined) setMonth(next.month);
                  if (next.day !== undefined) setDay(next.day);
                }}
                error={errors.birth}
              />
              <LayeredButton
                disabled={!isValid}
                theme={!isValid ? 'gray' : 'red'}>
                {loading ? '저장 중...' : '저장'}
              </LayeredButton>
            </form>
          </section>
        </div>
      </motion.div>
    </ModalBackground>
  );
}
