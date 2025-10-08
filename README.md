# 실전처럼 요튜브 Clone 만들어보기

React Native를 활용하여 YouTube 인기 동영상 목록을 보여주는 모바일 애플리케이션입니다. 

## 프로젝트 개요

이 프로젝트는 다음과 같은 실무 개발 프로세스를 따라 진행되었습니다:

1. **기획서 검토** - 요구사항 분석 및 기능 정의
2. **YouTube Data API v3 조사** - API 스펙 확인 및 활용 방안 검토
3. **네트워크 라이브러리 선택** - Axios vs Fetch 비교 분석
4. **API 연동 구현** - YouTube 인기 동영상 데이터 호출
5. **무한 스크롤 구현** - 페이지네이션을 활용한 UX 최적화

## 주요 기능

### 인기 동영상 목록
- YouTube Data API v3를 통해 실시간 인기 동영상 데이터 가져오기
- 한국(KR) 지역 기준 인기 차트 표시
- 동영상 썸네일, 제목, 채널명, 조회수, 게시일 정보 제공

### 무한 스크롤 (Infinity Scroll)
- `FlatList`의 `onEndReached` 이벤트를 활용한 자동 데이터 로딩
- `pageToken`을 이용한 페이지네이션 구현
- `hasNextPage` 상태로 추가 데이터 존재 여부 관리
- 스크롤 시 자연스러운 데이터 추가 로딩

## 기술 스택

- **React Native** `0.81.4` - 크로스 플랫폼 모바일 앱 프레임워크
- **React** `19.1.0` - UI 라이브러리
- **TypeScript** `5.8.3` - 타입 안정성을 위한 정적 타입 언어

### 네트워크
- **Axios** `1.12.2` - HTTP 클라이언트
  - **Fetch 대비 장점**:
    - 자동 JSON 변환
    - 요청/응답 인터셉터 지원
    - 요청 취소 기능
    - 더 나은 에러 핸들링
    - baseURL 설정으로 코드 간결화

### API
- **YouTube Data API v3** - Google 제공 공식 YouTube 데이터 API
  - `videos` 엔드포인트 활용
  - `snippet`, `contentDetails`, `statistics` 파트 조회

### 상태 관리
- **React Hooks** - useState, useCallback을 활용한 상태 관리
- **Custom Hook** - 비즈니스 로직 분리 (useYotubeData)

### 환경 변수 관리(강의 외 추가 코드)
- **react-native-dotenv** `3.4.11` - 환경 변수 관리
  - `.env` 파일로 API 키 보안 관리
  - Babel 플러그인을 통한 빌드 타임 주입

## 프로젝트 구조

```
yotube/
├── src/
│   ├── components/           # UI 컴포넌트
│   │   ├── ListView.tsx      # 메인 리스트 뷰 (FlatList 구현)
│   │   └── ListItemView.tsx  # 개별 동영상 아이템 컴포넌트
│   ├── hooks/                # Custom Hooks
│   │   ├── useYotubeData.ts  # YouTube API 데이터 관리 훅
│   │   └── TypeVideoResults.ts # API 응답 타입 정의
│   └── model/                # 타입 정의
│       └── TypeListItem.ts   # 리스트 아이템 타입
├── android/                  # Android 네이티브 코드
├── ios/                      # iOS 네이티브 코드
├── App.tsx                   # 앱 진입점
├── .env                      # 환경 변수 (API 키)
├── babel.config.js           # Babel 설정
├── tsconfig.json             # TypeScript 설정
└── package.json              # 프로젝트 의존성
```

### 핵심 컴포넌트 설명

#### `useYotubeData` Hook
```ts
// YouTube API 데이터 로딩 및 무한 스크롤 로직 관리
const { data, loadData, loadMoreData } = useYotubeData();
```
- **data**: 동영상 목록 상태
- **loadData**: 초기 데이터 로딩 함수
- **loadMoreData**: 추가 데이터 로딩 함수 (무한 스크롤)
- **nextPageToken**: 페이지네이션 토큰 관리
- **hasNextPage**: 다음 페이지 존재 여부

#### `ListView` Component
```tsx
// FlatList를 활용한 리스트 렌더링
<FlatList
  data={data}
  renderItem={({ item }) => <ListItemView {...item} />}
  onEndReached={loadMoreData}  // 무한 스크롤 구현
  onEndReachedThreshold={0.1}  // 하단 10% 도달 시 트리거(onEndReached)
  ListFooterComponent={<LoadingIndicator />} // 강의 외 추가코드
/>

```

#### `ListItemView` Component
- 동영상 썸네일, 제목, 채널명, 조회수, 게시일 표시
- YouTube 스타일의 리스트 아이템 UI 구현

#### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 YouTube API 키를 추가합니다:

```bash
YOTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE
```

## 🔧 주요 구현 내용

### 1. Axios 인스턴스 설정

```typescript
const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  timeout: 10000, // 10초 타임아웃
  params: {
    // 정적인 파라미터들을 기본값으로 설정
    part: 'snippet, contentDetails, statistics',
    chart: 'mostPopular',
    regionCode: 'KR',
    key: YOTUBE_API_KEY,
  },
});
```

**장점**:
- `baseURL`: 모든 요청에서 반복되는 URL 제거
- `timeout`: 요청 타임아웃 설정으로 응답 없는 경우 자동 중단
- `params`: 정적인 쿼리 파라미터를 기본값으로 설정하여 코드 중복 제거
- 이제 API 호출 시 동적인 파라미터(`pageToken` 등)만 전달하면 됨

### 2. 무한 스크롤 구현

```typescript
const [hasNextPage, setHasNextPage] = useState(true);
const [nextPageToken, setNextPageToken] = useState<NextPageToken>(null);

// 초기 데이터 로딩 - 파라미터 전달 불필요 (axios.create에서 설정)
const loadData = useCallback(async () => {
  const videoResults = await axiosInstance.get<TypeVideoResults>('/videos');
  setData(/* 데이터 매핑 */);
}, []);

// 추가 데이터 로딩 - 동적인 pageToken만 전달
const loadMoreData = useCallback(async () => {
  if (!hasNextPage) return;
  
  const videoResults = await axiosInstance.get('/videos', {
    params: {
      pageToken: nextPageToken,  // 동적인 파라미터만 전달
    },
  });
  
  // 기존 데이터에 새 데이터 추가
  setData(prevData => prevData.concat(newData));
}, [hasNextPage, nextPageToken]);
```

**핵심 포인트**:
- `axios.create`에 정적 파라미터를 설정했으므로 API 호출 시 코드가 매우 간결함
- 동적인 `pageToken`만 필요할 때 전달
- axios가 자동으로 기본 params와 요청별 params를 병합

### 3. 환경 변수 보안 처리

```js
// babel.config.js
plugins: [
  [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
    },
  ],
]

// 사용
import { YOTUBE_API_KEY } from '@env';
```

API 키를 코드에 직접 노출하지 않고 환경 변수로 관리합니다.
