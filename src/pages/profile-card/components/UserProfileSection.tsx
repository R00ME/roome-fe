import exProfile from '@assets/rank/exProfile.png';
import { useWindowSize } from '@/hooks/useWindowSize';

interface UserProfileSectionProps {
  profile: Pick<UserProfile, 'nickname' | 'profileImage' | 'bio'>;
}

const UserProfileSection = ({ profile }: UserProfileSectionProps) => {
  const { nickname, profileImage, bio } = profile;
  const { width } = useWindowSize();
  const isMobile = width <= 640;

  if (isMobile) {
    return (
      <div
        aria-label='사용자 프로필'
        className='flex items-center gap-2 mt-6'>
        <img
          src={profileImage || exProfile}
          alt='사용자 프로필'
          className='rounded-full h-14 w-14 object-cover'
        />
        <div className='flex flex-col'>
          <h2 className='text-md font-bold text-[#3E507D]'>{nickname}</h2>
          <p className='text-xs font-medium text-[#AFAFAF]'>
            {bio || '아직 자기소개가 없어요 ｡°(っ°´o`°ｃ)°｡'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label='사용자 프로필'
      className='flex flex-col items-center'>
      <img
        src={profileImage || exProfile}
        alt='사용자 프로필'
        className='rounded-full h-25 w-25 object-cover'
      />
      <h2 className='text-2xl font-bold text-[#3E507D] mt-2'>{nickname}</h2>
      <p className='text-sm font-medium text-[#AFAFAF] mt-1'>
        {bio || '아직 자기소개가 없어요 ｡°(っ°´o`°ｃ)°｡'}
      </p>
    </div>
  );
};

export default UserProfileSection;
