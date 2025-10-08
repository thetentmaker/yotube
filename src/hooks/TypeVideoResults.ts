type TypeVideoResults = {
    kind: 'youtube#videoListResponse';
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    items: [
      {
        kind: 'youtube#video';
        etag: string;
        id: string;
        snippet: {
          publishedAt: string;
          channelId: string;
          title: string;
          description: string;
          thumbnails: {
            [key: string]: {
              url: string;
              width: number;
              height: number;
            };
          };
          channelTitle: string;
          tags?: string[];
          categoryId: string;
          liveBroadcastContent: string;
          defaultLanguage?: string;
          localized?: {
            title: string;
            description: string;
          };
          defaultAudioLanguage?: string;
        };
        contentDetails: {
          duration: string;
          dimension: string;
          definition: string;
          caption: string;
          licensedContent: boolean;
          regionRestriction?: {
            allowed?: string[];
            blocked?: string[];
          };
          contentRating?: {
            [key: string]: any;
          };
          projection: string;
          hasCustomThumbnail?: boolean;
        };
        statistics: {
          viewCount: string;
          likeCount?: string;
          dislikeCount?: string;
          favoriteCount: string;
          commentCount?: string;
        };
      },
    ];
  };

export default TypeVideoResults;