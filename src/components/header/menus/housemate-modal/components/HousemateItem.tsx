import rightIcon from '@/assets/housemate-right-icon.svg';
import { useNavigate } from 'react-router-dom';

interface HousemateItemProps {
  userId: number;
  nickname: string;
  profileImage?: string;
  bio?: string;
  status: 'ONLINE' | 'OFFLINE';
}

export const HousemateItem = ({
  userId,
  nickname,
  profileImage,
  bio,
  status,
}: HousemateItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <li
      className='gap-3 cursor-pointer item-between'
      onClick={handleClick}>
      <div
        aria-label='프로필 정보'
        className='gap-2 item-middle'>
        <img
          src={
            profileImage ||
            'https://i.pinimg.com/736x/cc/5d/07/cc5d07daf1f1872eeebbfc1998b3adad.jpg'
          }
          alt='profile'
          className='object-cover w-10 h-10 rounded-full'
        />
        <div aria-label='닉네임 및 상태'>
          <p className='flex items-center gap-2'>
            <span className='font-bold text-[#503A44] text-sm'>{nickname}</span>
            <i
              aria-label={`${status === 'ONLINE' ? '온라인' : '오프라인'} 상태`}
              className={`w-2 h-2 rounded-full ${
                status === 'ONLINE' ? 'bg-[#61E509]' : 'bg-gray-300'
              }`}
            />
          </p>
          {bio && (
            <span
              aria-label='소개'
              className='text-xs text-[#503A44]/70 font-medium'>
              {bio}
            </span>
          )}
        </div>
      </div>
      <button className='flex items-center justify-center w-8 h-8'>
        <img
          src={rightIcon}
          alt='하우스메이트 페이지 바로가기'
          className='w-full h-full'
        />
      </button>
    </li>
  );
};
