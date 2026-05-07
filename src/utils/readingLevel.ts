export interface ReadingLevel {
  level: number;
  title: string;
  description: string;
  features: string;
  uxPoint: string;
}

export const READING_LEVELS: ReadingLevel[] = [
  {
    level: 1,
    title: '탐색 단계',
    description: '아직 독서 습관이 자리 잡는 중이에요. 짧은 글부터 천천히 시작하는 타입.',
    features: '단편·에세이 위주, 중도 이탈 잦음',
    uxPoint: '부담 없는 추천 필요',
  },
  {
    level: 2,
    title: '가벼운 독서자',
    description: '흥미가 생기면 읽지만, 꾸준함은 아직 약해요.',
    features: '월 0~1권, 짧은 챕터 선호',
    uxPoint: '완독 경험 강화',
  },
  {
    level: 3,
    title: '간헐적 독서자',
    description: '컨디션이 맞는 날에 집중해서 읽는 편이에요.',
    features: '몰아서 읽기, 공백 기간 존재',
    uxPoint: '리마인드 기능 유효',
  },
  {
    level: 4,
    title: '루틴 형성 중',
    description: '읽는 리듬이 생기기 시작했어요.',
    features: '월 1~2권, 완독률 안정',
    uxPoint: '성취 배지 제공 적합',
  },
  {
    level: 5,
    title: '안정적 독서자',
    description: '독서가 일상의 한 부분이에요.',
    features: '정기적 독서 시간 확보',
    uxPoint: '취향 분석 정확도 상승 구간',
  },
  {
    level: 6,
    title: '몰입형 독서자',
    description: '이야기에 빠지면 시간을 잊고 읽어요.',
    features: '장편 소설도 무리 없음',
    uxPoint: '서사 중심 추천 강화',
  },
  {
    level: 7,
    title: '지속적 완독자',
    description: '끝까지 읽는 힘이 강한 타입이에요.',
    features: '완독률 높음, 재독 발생',
    uxPoint: '작가·세계관 기반 추천',
  },
  {
    level: 8,
    title: '고난이도 독서자',
    description: '밀도 높은 책도 즐길 수 있어요.',
    features: '철학·인문·비문학 비중 증가',
    uxPoint: '난이도 필터 적극 활용',
  },
  {
    level: 9,
    title: '헤비 리더',
    description: '독서가 주요 취미이자 사고 도구예요.',
    features: '월 4권 이상, 독서 시간 길음',
    uxPoint: '통계·분석 콘텐츠 선호',
  },
  {
    level: 10,
    title: '독서 마스터',
    description: '읽는 행위 자체가 정체성이에요.',
    features: '장르 무관, 고난이도 장편 지속 소비',
    uxPoint: '큐레이터/추천 기준 유저로 활용 가능',
  },
];

// totalBooksRead 기반 레벨 산정
const LEVEL_THRESHOLDS = [0, 3, 7, 12, 20, 30, 45, 60, 80, 101];

export const getReadingLevel = (totalBooksRead: number): ReadingLevel => {
  let levelIndex = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalBooksRead >= LEVEL_THRESHOLDS[i]) {
      levelIndex = i;
      break;
    }
  }
  return READING_LEVELS[levelIndex];
};
