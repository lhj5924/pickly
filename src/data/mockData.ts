import { Book, Review, ReadingStats, GenreStats } from '@/types';

// ===========================
// Reading Statistics
// ===========================
export const readingStats: ReadingStats = {
  totalBooks: 12,
  averageReadingDays: 5,
  monthlyAverage: 3,
};

// ===========================
// Genre Chart Data
// ===========================
export interface ChartSegment {
  name: string;
  value: number;
}

export const genreChartData: ChartSegment[] = [
  { name: '소설', value: 54 },
  { name: '에세이', value: 34 },
  { name: '경제경영', value: 12 },
];

export const keywordChartData: ChartSegment[] = [
  { name: '로맨스', value: 40 },
  { name: '성장', value: 35 },
  { name: '힐링', value: 25 },
];

// ===========================
// Banner Data
// ===========================
export interface BannerItem {
  id: number;
  book: {
    title: string;
    coverImage: string;
  };
  quote: string;
}

export const bannerData: BannerItem[] = [
  {
    id: 1,
    book: {
      title: '나나 올리브에게',
      coverImage: 'https://image.yes24.com/goods/109933559/XL',
    },
    quote: '서운해하지는 마세요. 물건들에게도 계절이 있다면, 긴 겨울이 지나 봄이 온 것뿐이에요.',
  },
  {
    id: 2,
    book: {
      title: '배너 2',
      coverImage: '',
    },
    quote: '',
  },
  {
    id: 3,
    book: {
      title: '배너 3',
      coverImage: '',
    },
    quote: '',
  },
];

// ===========================
// Books
// ===========================
export const allBooks: Book[] = [
  {
    id: '1',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    publisher: '오마이북스',
    publishDate: '2019년 01월 30일',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    description: '별과 우주에 관한 가장 인간적인 이야기',
    pageCount: 280,
    categories: [
      { id: 12, name: '자연과학' },
      { id: 11, name: '천문학' },
    ],
    status: 'completed',
  },
  {
    id: '2',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    publisher: '문학동네',
    publishDate: '2023년 10월 16일',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
    description: 'SF 소설',
    pageCount: 320,
    categories: [
      { id: 1, name: '소설' },
      { id: 4, name: 'SF' },
    ],
    status: 'completed',
  },
  {
    id: '3',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    publisher: '위즈덤하우스',
    publishDate: '2022년 08월 15일',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    pageCount: 260,
    categories: [{ id: 8, name: '시/에세이' }],
    status: 'completed',
  },
  {
    id: '4',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
    status: 'reading',
    progress: 36,
  },
  {
    id: '5',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
    status: 'reading',
    progress: 65,
  },
  {
    id: '6',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
    status: 'reading',
    progress: 42,
  },
  {
    id: '7',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
    status: 'reading',
    progress: 80,
  },
  {
    id: '8',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
    status: 'reading',
    progress: 55,
  },
  {
    id: '9',
    title: '우리가 빛의 속도로 갈 수 없다면',
    author: '김초엽',
    publisher: '허블',
    publishDate: '2019년 06월 24일',
    coverImage: 'https://image.yes24.com/goods/77091141/XL',
    description: 'SF 소설',
    pageCount: 272,
    categories: [
      { id: 4, name: 'SF' },
      { id: 1, name: '소설' },
    ],
    status: 'wishlist',
  },
  {
    id: '10',
    title: '다읽은_우리가 빛의 속도로 갈 수 없다면',
    author: '김초엽',
    publisher: '허블',
    publishDate: '2019년 06월 24일',
    coverImage: 'https://image.yes24.com/goods/77091141/XL',
    description: 'SF 소설',
    pageCount: 272,
    categories: [
      { id: 4, name: 'SF' },
      { id: 1, name: '소설' },
    ],
    status: 'completed',
  },
  {
    id: '11',
    title: '다읽은1_우리가 빛의 속도로 갈 수 없다면',
    author: '김초엽',
    publisher: '허블',
    publishDate: '2019년 06월 24일',
    coverImage: 'https://image.yes24.com/goods/77091141/XL',
    description: 'SF 소설',
    pageCount: 272,
    categories: [
      { id: 4, name: 'SF' },
      { id: 1, name: '소설' },
    ],
    status: 'completed',
  },
  {
    id: '12',
    title: '다읽은2_우리가 빛의 속도로 갈 수 없다면',
    author: '김초엽',
    publisher: '허블',
    publishDate: '2019년 06월 24일',
    coverImage: 'https://image.yes24.com/goods/77091141/XL',
    description: 'SF 소설',
    pageCount: 272,
    categories: [
      { id: 4, name: 'SF' },
      { id: 1, name: '소설' },
    ],
    status: 'completed',
  },
];

// Helper functions to filter books by status
export const getBooksByStatus = (status: Book['status']) => allBooks.filter(book => book.status === status);

export const getCompletedBooks = () => getBooksByStatus('completed');
export const getReadingBooks = () => getBooksByStatus('reading');
export const getWishlistBooks = () => getBooksByStatus('wishlist');

// ===========================
// Recommendations
// ===========================
export const aiRecommendations: Book[] = [
  {
    id: 'rec-1',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'rec-2',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'rec-3',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'rec-4',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
];

export const similarBooks: Book[] = [
  {
    id: 'sim-1',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'sim-2',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'sim-3',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'sim-4',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
  {
    id: 'sim-5',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '',
    publisher: '',
    publishDate: '',
    pageCount: 0,
    categories: [],
  },
];

// ===========================
// Reviews
// ===========================
export const mockReviews = [
  {
    id: '1',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '2',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '3',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '4',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '5',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '6',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '7',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
  {
    id: '8',
    book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' },
    content:
      '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..',
  },
];

// ===========================
// Stats page data
// ===========================
export const monthlyBarData = [
  { label: '1월', value: 20.5 },
  { label: '5/13 - 5/20', value: 20.5 },
  { label: '5/20 - 5/27', value: 20.5 },
  { label: '5/27 - 6/3', value: 20.5 },
  { label: '6/3 - 6/10', value: 20.5 },
  { label: '6/10 - 6/17', value: 3.4, highlight: true },
];

export const staleReadingBooks = [
  { id: '1', coverImage: 'https://image.yes24.com/goods/124857283/XL', date: '2025년 3월 3일부터 읽는 중' },
  { id: '2', coverImage: 'https://image.yes24.com/goods/124857283/XL', date: '2025년 3월 3일부터 읽는 중' },
  { id: '3', coverImage: 'https://image.yes24.com/goods/124857283/XL', date: '2025년 3월 3일부터 읽는 중' },
  { id: '4', coverImage: 'https://image.yes24.com/goods/124857283/XL', date: '2025년 3월 3일부터 읽는 중' },
  { id: '5', coverImage: 'https://image.yes24.com/goods/124857283/XL', date: '2025년 3월 3일부터 읽는 중' },
];

// ===========================
// Recommend page data
// ===========================
export const genreRecommendBooks = [
  {
    id: 'gr-1',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    subtitle: '당연하게도 나는 너를',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
  },
  {
    id: 'gr-2',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    subtitle: '당연하게도 나는 너를',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
  },
  {
    id: 'gr-3',
    title: '당연하게도 나는 너를',
    author: '이꽃',
    subtitle: '당연하게도 나는 너를',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
  },
];

export const popularBooks = [
  {
    id: 'pop-1',
    title: '"나가 했던 어느 날에" 의',
    subtitle: '비슷한 작품이에요!',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
  },
  {
    id: 'pop-2',
    title: '"나가 했던 어느 날에" 의',
    subtitle: '비슷한 작품이에요!',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
  },
  {
    id: 'pop-3',
    title: '"나가 했던 어느 날에" 의',
    subtitle: '비슷한 작품이에요!',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
  },
];

export const hiddenTasteBooks = [
  {
    id: 'ht-1',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
    quote: '"어선원지가 내 번채 평에서 만났던 분들 세는 사업가를 가이미시닙요?"',
  },
  {
    id: 'ht-2',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    quote: '"어선원지가 내 번채 평에서 만났던 분들 세는 사업가를 가이미시닙요?"',
  },
];

// ===========================
// Book Detail
// ===========================
export const bookDetailData: Book = {
  id: '1',
  title: '우리는 모두 천문학자로 태어난다',
  description: `김범준, 안민진, 정영진, 이강민, 진동혁리다 강력 추천!
별과 우주, 관측의 역사가 우리에게 알려 주는 것
"별을 바라보는 것은 가장 인간다운 행위다."

당신이 마지막으로 밤하늘을 올려다본 때는 언제입니까? 어제 지나주주? 지난달? 혹은 기억도 나지 않는 과거? 우리는 보무 애매 위에 하늘을 이고 살 있고 있어이지도 연쇄기부터 하늘을 제 대로 올려다보지 않게 저이다. 눈밭만 걸자. 오늘 때나 해지무르오 할 밤은, 당시 가가 할 곧은 많만느라고 자개를 옷어 이하늘을 를 머무도 않게 것이다.

그런 당신을 위한 단 한 권의 현존도 책이 여기에 있다. 서남시타 단장 물, 주간 도노 논후적게설 넵더 영상으로 헤에곰 진드로 '우주의 시년에 배우" 저로해 최가는 천문학자기님 팝하농을 바하면는는 당초 중요정이는 단포 이이지는 시에에 돋면해기고 뱌니다.`,
  coverImage: 'https://image.yes24.com/goods/124857283/XL',
  author: '지웅배',
  publisher: '오마이북스',
  publishDate: '2019년 01월 30일',
  pageCount: 280,
  categories: [
    { id: 12, name: '자연과학' },
    { id: 11, name: '철학적' },
  ],
};

export const authorDescription = `지웅배
우주와 사업에 빠진 천문과자, 우주를 너무 사랑한 나머저 연정 좋무터 배가어, 메트와 밤고 다니는 노트북지 천를 별과 우주로 가득하며, 구독자 수 26만 명인 유주인지와 인지태안 천, 고리고 다양한 관엄을 통해 최실 천문학적 늘압을 소개하며 대중과 가까이 즐거이 위해 일읽에 면단 한는 구려 카팩나빼어어아이기도 하다.`;

// ===========================
// Search books (for review writing)
// ===========================
export const searchableBooks: Book[] = [
  {
    id: '1',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    publisher: '오마이북스',
    publishDate: '2019년 01월 30일',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    description: '별과 우주에 관한 가장 인간적인 이야기',
    pageCount: 280,
    categories: [
      { id: 12, name: '자연과학' },
      { id: 11, name: '천문학' },
    ],
  },
  {
    id: '2',
    title: '우리가 빛의 속도로 갈 수 없다면',
    author: '김초엽',
    publisher: '허블',
    publishDate: '2019년 06월 24일',
    coverImage: 'https://image.yes24.com/goods/77091141/XL',
    description: 'SF 소설',
    pageCount: 272,
    categories: [
      { id: 4, name: 'SF' },
      { id: 1, name: '소설' },
    ],
  },
  {
    id: '3',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [
      { id: 12, name: '과학' },
      { id: 9, name: '자기계발' },
    ],
  },
];
