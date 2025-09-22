import { useCallback, useEffect, useOptimistic, useRef, useState } from 'react';
import {
  addCdToMyRack,
  deleteCdsFromMyRack,
  getCdRack,
} from '../../../apis/cd';
import { useToastStore } from '../../../store/useToastStore';
import { mapToPostCDInfo } from '../../../utils/cdMapper';

export default function useCdRackData(
  targetUserId: number | null,
  pageSize = 14,
) {
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

        const res: CDRackInfo = await getCdRack(
          targetUserId,
          pageSize,
          cursor ?? undefined,
        );
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
        setHasMore(nc !== 0 && mapped.length > 0 && list.length >= pageSize);
      } catch (error) {
        console.error('🚨 CD 데이터 패칭에 실패했습니다. :', error);
      } finally {
        setInitialLoading(false);
        setIsFetchingMore(false);
        inFlight.current = false;
      }
    },
    [targetUserId, pageSize, hasMore],
  );

  useEffect(() => {
    if (targetUserId) fetchPage(undefined);
  }, [targetUserId, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || inFlight.current) return;
    fetchPage(nextCursor);
  }, [fetchPage, nextCursor, hasMore]);

  const addCd = useCallback(
    async (rawCd: RawCDInfo) => {
      const payload = mapToPostCDInfo(rawCd);

      const tempId = Date.now();
      const tempItem: CdItem = {
        myCdId: tempId,
        coverUrl: payload.coverUrl,
        title: payload.title,
        artist: payload.artist,
        album: payload.album,
        genres: payload.genres ?? [],
        releaseDate: payload.releaseDate ?? '',
        youtubeUrl: payload.youtubeUrl ?? '',
        duration: payload.duration ?? 0,
      };

      setOptimisticItems([...optimisticItems, tempItem]);

      try {
        const res = await addCdToMyRack(payload);
        if (res?.data) {
          setOptimisticItems((prev) =>
            prev.map((item) => (item.myCdId === tempId ? res.data : item)),
          );
          setItems((prev) => [...prev, res.data]);
        }
      } catch (err) {
        console.error('🚨 CD 추가 실패 (rollback):', err);
        setOptimisticItems((prev) =>
          prev.filter((item) => item.myCdId !== tempId),
        );
      }
    },
    [setOptimisticItems, optimisticItems],
  );

  const deleteCd = useCallback(
    async (myCdIds: number[]) => {
      setOptimisticItems(
        optimisticItems.filter((cd) => !myCdIds.includes(cd.myCdId)),
      );

      try {
        await deleteCdsFromMyRack(myCdIds);

        setItems((prev) => prev.filter((cd) => !myCdIds.includes(cd.myCdId)));
        showToast('성공적으로 음악이 삭제 되었어요!', 'success');

        await fetchPage(null);
      } catch (err) {
        console.error('🚨 CD 삭제 실패 (rollback):', err);
        showToast('다시 시도해주세요', 'error');

        fetchPage(null);
      }
    },
    [setOptimisticItems, optimisticItems, fetchPage, showToast],
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
