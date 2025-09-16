import RecommendedUserListItem from './RecommendedUserListItem';

interface RecommendedUserListProps {
  users: RecommendedUser[];
}

const RecommendedUserList = ({ users }: RecommendedUserListProps) => {
  return (
    <div className='flex flex-col w-full gap-4 bg-[#F9F4FB] rounded-2xl px-8 py-4 max-sm:px-4 max-sm:py-3 max-sm:rounded-xl max-sm:font-sm'>
      <h3 className='text-[#224DBA] text-lg font-bold text-center max-sm:text-md'>
        취향이 비슷한 유저
      </h3>
      <ul className='w-full gap-3 item-middle overflow-x-auto overflow-y-hidden max-sm:gap-1.5 max-sm:justify-start'>
        {users.length > 0 ? (
          users.map((user) => (
            <RecommendedUserListItem
              key={user.userId}
              user={user}
            />
          ))
        ) : (
          <li className='text-sm text-[#3E507D] text-center py-4 max-sm:text-xs'>
            취향이 비슷한 유저를 분석하는 중 ૮꒰ ⸝⸝´ ˘ ` ⸝⸝꒱ა
          </li>
        )}
      </ul>
    </div>
  );
};

export default RecommendedUserList;
