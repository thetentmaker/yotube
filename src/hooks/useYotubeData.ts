import { useCallback, useState } from 'react';
import TypeListItem from '../model/TypeListItem';
import axios from 'axios';
import { YOTUBE_API_KEY } from '@env';
import TypeVideoResults from './TypeVideoResults';

const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
});

type NextPageToken = string | null;

const useYotubeData = () => {
  const [data, setData] = useState<TypeListItem[]>([]);
  // inifinity scroll을 구현할거야.
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<NextPageToken>(null);

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
      setHasNextPage(typeof videoResults.data.nextPageToken !== 'undefined');
      setNextPageToken(
        typeof videoResults.data.nextPageToken !== 'undefined'
          ? videoResults.data.nextPageToken
          : null,
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadMoreData = useCallback(async () => {
    if (!hasNextPage) return;
    try {
      const videoResults = await axiosInstance.get<TypeVideoResults>(
        '/videos',
        {
          params: {
            part: 'snippet, contentDetails, statistics',
            chart: 'mostPopular',
            regionCode: 'KR',
            key: YOTUBE_API_KEY,
            pageToken: nextPageToken,
          },
        },
      );
      console.log('YouTube API Response:', videoResults.data);
      setData(prevData =>
        prevData.concat(
          videoResults.data.items.map(item => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt,
            viewCount: parseInt(item.statistics.viewCount, 10),
            channelTitle: item.snippet.channelTitle,
          }))
        )
      );
      setHasNextPage(typeof videoResults.data.nextPageToken !== 'undefined');
      setNextPageToken(
        typeof videoResults.data.nextPageToken !== 'undefined'
          ? videoResults.data.nextPageToken
          : null,
      );
    } catch (error) {
      console.error(error);
    }
  }, [hasNextPage, nextPageToken]);
  return { data, loadData, loadMoreData };
};

export default useYotubeData;
