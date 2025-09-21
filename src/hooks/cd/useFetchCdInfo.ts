import { getCdInfo } from '@apis/cd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useFetchCdInfo = () => {
  const [cdInfo, setCdInfo] = useState<CDInfo | null>(null);
  const [isCdPlaying, setIsCdPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const myCdId = Number(useParams().cdId);
  const userId = Number(useParams().userId);

  useEffect(() => {
    const fetchCdInfo = async () => {
      try {
        const result = await getCdInfo(myCdId, userId);

        setCdInfo(result);
        setIsCdPlaying(false);
      } catch (error) {
        console.error(error);
        setError('CD 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCdInfo();
  }, [myCdId, userId]);

  return {
    cdInfo,
    isCdPlaying,
    isLoading,
    error,
    userId,
    setIsCdPlaying,
  };
};
