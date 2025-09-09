import { useCallback, useEffect, useOptimistic, useRef, useState } from 'react';
import {
  addCdToMyRack,
  deleteCdsFromMyRack,
  getCdRack,
} from '../../../apis/cd';
import { mockGetCdRack } from '../../../apis/mockCd';
import { useToastStore } from '../../../store/useToastStore';

type Options = {
  pageSize?: number;
  useMock?: boolean;
};

export default function useCdRackData(
  targetUserId: number | null,
  pageSize = 14,
  opts: Options = {},
) {
  const { useMock = false } = opts;
  const [items, setItems] = useState<CdItem[]>([]);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);

  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const inFlight = useRef(false);
    const { showToast } = useToastStore();
  

  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    setHasMore(true);
  }, [targetUserId]);

  const fetchPage = useCallback(
    async (cursor?: number | null) => {
      if (!targetUserId || inFlight.current || !hasMore) return;
      try {
        inFlight.current = true;
        if (cursor == null) setInitialLoading(true);
        else setIsFetchingMore(true);

        let res: CDRackInfo;
        if (useMock) {
          res = await mockGetCdRack(
            targetUserId,
            pageSize,
            cursor ?? undefined,
          );
        } else {
          res = await getCdRack(targetUserId, pageSize, cursor ?? undefined);
        }

        const list: CDRackItem[] = res?.data ?? [];

        const mapped: CdItem[] = list.map((cd) => ({
          myCdId: cd.myCdId,
          coverUrl: cd.coverUrl,
          title: cd.title,
          artist: cd.artist,
          album: cd.album,
          genres: cd.genres,
          releaseDate: cd.releaseDate ?? '',
          youtubeUrl: cd.youtubeUrl ?? '',
          duration: cd.duration ?? 0,
        }));

        setItems((prev) => {
          const seen = new Set(prev.map((x) => x.myCdId));
          const merged = prev.concat(mapped.filter((m) => !seen.has(m.myCdId)));
          return merged;
        });

        const nc = res.nextCursor;
        setNextCursor(nc !== 0 ? nc : null);
        setHasMore(nc !== 0 && mapped.length > 0);
      } catch (error) {
        console.error('🚨 CD 데이터 패칭에 실패했습니다. :', error);
      } finally {
        setInitialLoading(false);
        setIsFetchingMore(false);
        inFlight.current = false;
      }
    },
    [targetUserId, pageSize, hasMore, useMock],
  );

  useEffect(() => {
    if (targetUserId) fetchPage(undefined);
  }, [targetUserId, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || inFlight.current) return;
    fetchPage(nextCursor);
  }, [fetchPage, nextCursor, hasMore]);

  const addCd = useCallback(
    async (cdData: PostCDInfo) => {
      const tempItem: CdItem = {
        myCdId: Date.now(),
        coverUrl: cdData.coverUrl,
        title: cdData.title,
        artist: cdData.artist,
        album: cdData.album,
        genres: cdData.genres ?? [],
        releaseDate: cdData.releaseDate ?? '',
        youtubeUrl: cdData.youtubeUrl ?? '',
        duration: cdData.duration ?? 0,
      };

      setOptimisticItems([...optimisticItems, tempItem]);

      try {
        const res = await addCdToMyRack(cdData);
        setItems((prev) => [...prev, res]);
      } catch (err) {
        console.error('🚨 CD 추가 실패 (rollback):', err);
        fetchPage(undefined);
      }
    },
    [setOptimisticItems, optimisticItems, fetchPage],
  );

const deleteCd = useCallback(
  async (myCdIds: number[]) => {
    setOptimisticItems(
      optimisticItems.filter((cd) => !myCdIds.includes(cd.myCdId))
    );

    try {
      await deleteCdsFromMyRack(myCdIds);

      setItems((prev) => prev.filter((cd) => !myCdIds.includes(cd.myCdId)));
      showToast('성공적으로 음악이 삭제 되었어요!', 'success');

    } catch (err) {
      console.error("🚨 CD 삭제 실패 (rollback):", err);
      showToast('다시 시도해주세요', 'error');

      fetchPage(undefined);
    }
  },
  [setOptimisticItems, optimisticItems, fetchPage]
);

  const isLoading = initialLoading || isFetchingMore;

  return {
    items: optimisticItems,
    initialLoading,
    isFetchingMore,
    isLoading,
    hasMore,
    loadMore,
    addCd,
    deleteCd,
  };
}
