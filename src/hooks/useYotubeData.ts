import { useCallback, useState } from 'react';
import TypeListItem from '../model/TypeListItem';
import axios from 'axios';
import { YOTUBE_API_KEY } from '@env';
import TypeVideoResults from './TypeVideoResults';

const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
});

const useYotubeData = () => {
  const [data, setData] = useState<TypeListItem[]>([]);

  const loadData = useCallback(async () => {
    try {
      const videoResults = await axiosInstance.get<TypeVideoResults>(
        '/videos',
        {
          params: {
            part: 'snippet, contentDetails, statistics',
            chart: 'mostPopular',
            regionCode: 'KR',
            key: YOTUBE_API_KEY,
          },
        },
      );
      console.log('YouTube API Response:', videoResults.data);
      setData(
        videoResults.data.items.map(item => ({
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
          viewCount: parseInt(item.statistics.viewCount, 10),
          channelTitle: item.snippet.channelTitle,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { data, loadData };
};

export default useYotubeData;
