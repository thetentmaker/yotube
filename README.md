# 실전처럼 요튜브 Clone 만들어보기

React Native를 활용하여 YouTube 인기 동영상 목록을 보여주는 모바일 애플리케이션입니다. 

## 프로젝트 개요

이 프로젝트는 다음과 같은 실무 개발 프로세스를 따라 진행되었습니다:

1. **기획서 검토** - 요구사항 분석 및 기능 정의
2. **YouTube Data API v3 조사** - API 스펙 확인 및 활용 방안 검토
3. **네트워크 라이브러리 선택** - Axios vs Fetch 비교 분
4. **API 연동 구현** - YouTube 인기 동영상 데이터 호출
5. **무한 스크롤 구현** - 페이지네이션을 활용한 UX 최적화

## 화면
|Home|
|-|
|<img src="./screenshot/home_1.png" width="300" />|

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

- **React Native** `0.81.4`
- **React** `19.1.0` 
- **TypeScript** `5.8.3`

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
const loadingIndicator = isLoading ? <LoadingIndicator /> : null;
// FlatList를 활용한 리스트 렌더링
<FlatList
  data={data}
  renderItem={({ item }) => <ListItemView {...item} />}
  onEndReached={loadMoreData}  // 무한 스크롤 구현
  onEndReachedThreshold={0.1}  // 하단 10% 도달 시 트리거(onEndReached)
  ListFooterComponent={loadingIndicator} // 강의 외 추가코드
/>

```

#### `ListItemView` Component
- 동영상 썸네일, 제목, 채널명, 조회수, 게시일 표시
- YouTube 스타일의 리스트 아이템 UI 구현

## 주요 구현 내용

### 1. Axios 인스턴스 설정

```typescript
const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
});
```

### 2. 무한 스크롤 구현

```typescript
const [hasNextPage, setHasNextPage] = useState(true);
const [nextPageToken, setNextPageToken] = useState<NextPageToken>(null); // 강의 외 추가 구현

// 초기 데이터 로딩
const loadData = useCallback(async () => {
  const videoResults = await axiosInstance.get<TypeVideoResults>('/videos', { // 강의 외 추가 구현
    params: {
      ...DEFAULT_PARAMS // 강의 외 추가 구현
    },    
  });
  setData(/* 데이터 매핑 */);
}, []);

// 추가 데이터 로딩
const loadMoreData = useCallback(async () => {
	if (!hasNextPage || isLoading) return; // 이미 로딩 중이면 중복 호출 방지
  
  const videoResults = await axiosInstance.get('/videos', {
    params: {
			...DEFAULT_PARAMS
      pageToken: nextPageToken,
    },
  });
  
  // 기존 데이터에 새 데이터 추가
  setData(prevData => prevData.concat(newData));
}, [hasNextPage, nextPageToken]);
```

## 추가학습

### Spread Operator vs Object Props

```tsx
// 방법 1: 스프레드 연산자 (현재 사용)
renderItem={({ item }) => <ListItemView {...item} />}

// 방법 2: 객체 전체 전달
renderItem={({ item }) => <ListItemView item={item} />}
```

**`{...item}`**: 객체의 모든 속성을 개별 props로 펼쳐서 전달
- `<ListItemView thumbnail="url" title="제목" ... />` 와 동일
- 컴포넌트에서 개별 props로 받음: `({ thumbnail, title })`

**`item={item}`**: 객체 전체를 하나의 prop으로 전달

- 컴포넌트에서 `item.속성명`으로 접근해야 함
- 구조 변경 필요: `({ item }) => <Text>{item.title}</Text>`



## TypeScript에서 Interface와 Type을 혼용할 수 있는 이유

![](/Users/jaeho/Documents/workspace_rn/yotube/screenshot/ts_to_js.png)

### 1. 구조적 타이핑 (Structural Typing)

TypeScript는 **이름이 아닌 구조(형태)**로 타입 호환성을 판단합니다.

typescript

```typescript
interface Person {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
}

// 이름은 다르지만 구조가 같으면 호환됨
const person: Person = { name: "John", age: 30 };
const user: User = person; // ✅ 가능!
```

### 2. 컴파일러의 동일한 처리

TypeScript 컴파일러는 `interface`와 `type`을 내부적으로 **동일한 구조**로 변환합니다.

typescript

```typescript
interface IUser { name: string; }
type TUser = { name: string; }

// 컴파일러 내부에서는 둘 다 → { name: string }
```

### 3. 런타임에는 모두 사라짐

컴파일 후 모든 타입 정보가 제거되므로, **성능 차이나 런타임 영향이 전혀 없습니다**.

typescript

```typescript
// TypeScript
function greet(user: IUser): void {
  console.log(user.name);
}

// 컴파일 후 JavaScript
function greet(user) {
  console.log(user.name);
}
```

### 4. 자유로운 확장과 조합

typescript

```typescript
interface BaseProps {
  id: number;
}

type WithName = {
  name: string;
}

// Interface + Type 혼용
type UserProps = BaseProps & WithName;
// 결과: { id: number; name: string; }
```

### 핵심 요약

1. **구조적 타이핑**: 구조만 같으면 호환 가능
2. **동일한 내부 처리**: 컴파일러가 둘을 같게 취급
3. **런타임 제거**: 컴파일 후 모두 사라져 성능 영향 없음
4. **자유로운 조합**: 상황에 맞게 혼용 가능

→ **결론**: 구조가 모든 것을 결정하므로 혼용 가능!
