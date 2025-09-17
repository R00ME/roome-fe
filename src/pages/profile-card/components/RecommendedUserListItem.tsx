import { useNavigate } from 'react-router-dom';
import exProfile from '@assets/rank/exProfile.png';


interface RecommendedUserListItemProps {
  user: RecommendedUser;
}

const RecommendedUserListItem = ({ user }: RecommendedUserListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <li
      onClick={handleClick}
      className='flex flex-col items-center w-[80px] h-[100px] py-4 bg-[#FDFCFE] shadow-md rounded-[10px] cursor-pointer hover:bg-[#FCF7FD]/80 transition-colors max-sm:w-[60px] max-sm:min-w-[60px] max-sm:h-[75px] max-sm:py-2 justify-left'>
      <div className='w-10 h-10 mb-2 shrink-0 max-sm:w-8 max-sm:h-8'>
        <img
          src={user.profileImage || exProfile}
          alt={`${user.nickname}님의 프로필`}
          className='w-full h-full rounded-full object-cover'
        />
      </div>
      <span className='text-sm text-[#3E507D] text-center w-full px-2 truncate font-semibold'>
        {user.nickname}
      </span>
    </li>
  );
};

export default RecommendedUserListItem;
