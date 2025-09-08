import { useCallback, useEffect, useRef, useState } from 'react';
import { getCdRack } from '../../apis/cd';
import { mockGetCdRack } from '../../apis/mockCd';

type Options = {
  pageSize?: number;
  useMock?: boolean;
};

export default function useFetchCdLists(
  targetUserId: number | null,
  pageSize = 14,
  opts: Options = {},
) {
  const { useMock = false } = opts;
  const [items, setItems] = useState<CdItem[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const inFlight = useRef(false);

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
    [targetUserId, pageSize, hasMore],
  );

  useEffect(() => {
    if (targetUserId) fetchPage(undefined);
  }, [targetUserId, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || inFlight.current) return;
    fetchPage(nextCursor);
  }, [fetchPage, nextCursor, hasMore]);

  const isLoading = initialLoading || isFetchingMore;

  return {
    items,
    initialLoading,
    isFetchingMore,
    isLoading,
    hasMore,
    loadMore,
  };
}
