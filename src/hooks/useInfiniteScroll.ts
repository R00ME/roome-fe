import { useRef, useEffect } from 'react';

interface UseInfiniteScrollProps {
  fetchMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const useInfiniteScroll = ({
  fetchMore,
  isLoading,
  hasMore,
}: UseInfiniteScrollProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      },
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchMore, isLoading, hasMore]);

  return { observerRef };
};
