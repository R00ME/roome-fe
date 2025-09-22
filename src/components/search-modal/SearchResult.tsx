import { bookAPI } from '@/apis/book';
import addIcon from '@/assets/add-icon.svg';
import { SEARCH_THEME } from '@/constants/searchTheme';
import { toKoreanDate } from '@utils/dateFormat';
import { addCdToMyRack, getYoutubeUrl, upgradeCdLevel } from '@apis/cd';
import { useUserStore } from '@/store/useUserStore';
import { useToastStore } from '@/store/useToastStore';
import AlertModal from '@components/AlertModal';
import { useState } from 'react';
import { BookType } from '@/types/book';
import ConfirmModal from '@/components/ConfirmModal';
import { ApiError } from '@/hooks/useSearch';

interface SearchResultProps {
  item: SearchItemType | null;
  type: 'CD' | 'BOOK';
  items: SearchItemType[];
  isLoading: boolean;
  error: string | null;
  onSelect: (item?: SearchItemType) => void;
  onClose: () => void;
  onSuccess?: (item: SearchItemType) => void;
  userId?: string;
}

export const SearchResult = ({
  item,
  type,
  isLoading,
  error,
  onSelect,
  onClose,
  onSuccess,
  userId,
}: SearchResultProps) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const theme = SEARCH_THEME[type];
  const { showToast } = useToastStore();

  const handleAdd = async (item: SearchItemType) => {
    try {
      // if (!userId) {
      //   showToast('잘못된 접근입니다.', 'error');
      //   return;
      // }

      if (type === 'BOOK') {
        const bookData: BookType = {
          isbn: item.id,
          title: item.title,
          author: item.author,
          publisher: item.publisher,
          publishedDate: new Date(item.date).toISOString().split('T')[0],
          imageUrl: item.imageUrl,
          genreNames: item.genres,
          page: 0,
        };
        const response = await bookAPI.addBookToMyBook(
          bookData,
          Number(userId),
        );
        onClose();
        showToast('책장에 책이 추가되었어요!', 'success');
        onSuccess?.({
          ...item,
          id: response.id.toString(),
          title: response.title,
          author: response.author,
          publisher: response.publisher,
          date: response.publishedDate,
          imageUrl: response.imageUrl,
          genres: response.genreNames,
        });
      } else if (type === 'CD') {
        // CD 추가 요청 로직

        const { youtubeUrl, duration } = await getYoutubeUrl(
          item.title,
          item.artist,
        );

        const cdData: PostCDInfo = {
          title: item.title,
          artist: item.artist,
          album: item.album_title,
          genres: item.genres,
          coverUrl: item.imageUrl,
          youtubeUrl: youtubeUrl,
          duration: duration,
          releaseDate: item.date,
        };

        // CD를 추가할 수 없는 경우
        if (
          !youtubeUrl ||
          !duration ||
          !cdData.title ||
          !cdData.artist ||
          !cdData.album ||
          !cdData.releaseDate
        ) {
          setIsAlertModalOpen(true);
          return;
        }

        onSelect({ ...item, youtubeUrl, duration });
        showToast('랙에 cd가 추가되었어요!', 'success');
        onClose();
      }
    } catch (error) {
      // // console.log(error.response?.data?.response);

      if (
        // 이건 정해진 문구라 못바꿈
        error.response?.data?.message ===
          '책장에 더 이상 책을 추가할 수 없습니다. 책장을 업그레이드 해주세요.' ||
        error.response?.data?.message === 'CD 랙의 저장 용량을 초과하였습니다.'
      ) {
        setIsUpgradeModalOpen(true);
      } else {
        showToast(
          error.response?.data?.message || '오류가 발생했어요.',
          'error',
        );
      }
      onSelect(null); // 낙관적 업데이트 실패시 되돌리기
      console.error(`${type} 추가 실패:`, error);
    }
  };

  const handleUpgrade = async (type: string) => {
    try {
      const user = useUserStore.getState().user;
      if (!user) return;

      if (type === 'BOOK') {
        await bookAPI.upgradeBookLevel(String(user.roomId));
        showToast('책장이 업그레이드 되었어요!', 'success');
      } else {
        await upgradeCdLevel(user.roomId);
        showToast('CD랙이 업그레이드 되었어요!', 'success');
      }
      setIsUpgradeModalOpen(false);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('업그레이드 실패:', apiError);
      showToast('업그레이드에 실패했어요.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full text-gray-400'>
        검색 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-full text-gray-400'>
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className='flex justify-center items-center h-full text-gray-400'>
        검색 결과를 선택해주세요
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
      {/* 출판일 / 발매일 */}
      <div className='flex flex-col gap-1 justify-center items-center'>
        <p className={`${theme.searchResultDate} font-mono tabular-nums`}>
          {toKoreanDate(item.date)}
        </p>
        <h3
          className={`text-xl font-bold text-center ${theme.searchResultText}`}>
          {item.title}
        </h3>
      </div>
      {/* 표지 / 앨범 커버 */}
      <div className='relative mb-4 w-auto h-70'>
        <img
          src={item.imageUrl}
          className='object-contain w-full h-full rounded-lg book-shadow'
        />
        <button
          onClick={() => handleAdd(item)}
          className={`absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 p-2 ${theme.searchResultAddBtn} rounded-full cursor-pointer backdrop-blur-xs`}>
          <img
            src={addIcon}
            alt='add'
            className='select-none'
          />
        </button>
      </div>
      <p className={`${theme.searchItemName} font-semibold text-lg`}>
        {item.author || item.artist}
      </p>
      {/* 장르 */}
      <div className='flex flex-wrap gap-2'>
        {item.genres?.map((genre) => (
          <span
            key={genre}
            className={`px-4 py-1 text-sm ${theme.searchGenre} ${theme.searchResultText} rounded-full`}>
            {genre}
          </span>
        ))}
      </div>
      {isAlertModalOpen && (
        <AlertModal
          onConfirm={() => setIsAlertModalOpen(false)}
          title='추가할 수 없는 CD에요!'
          subTitle='다른 CD를 선택해주세요.'
        />
      )}

      {isUpgradeModalOpen && (
        <ConfirmModal
          onClose={() => setIsUpgradeModalOpen(false)}
          onConfirm={() => handleUpgrade(type)}
          title={type === 'BOOK' ? `책장이 꽉 찼어요!` : 'CD랙이 꽉 찼어요!'}
          subTitle='400 포인트를 소모해 업그레이드 할 수 있어요.'
        />
      )}
    </div>
  );
};
