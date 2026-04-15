// ============================================================
// src/mocks/mockBooks.ts
// Dev-only mock data — seeded from GET /api/v1/books/search
// ============================================================

import type { BookSummary } from '@/types/book';

export const mockBooks: BookSummary[] = [
  {
    "uuid": "mock-book-001",
    "externalId": "8965820472_9788965820475",
    "isbn": "9788965820475",
    "title": "한국단편소설 40",
    "authors": [
      "김동인"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F922244%3Ftimestamp%3D20260310111009",
    "publishedDate": "2012-11-26",
    "publisher": "리베르",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-002",
    "externalId": "1124038191_9791124038192",
    "isbn": "9791124038192",
    "title": "나의 완벽한 장례식",
    "authors": [
      "조현선"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7123816%3Ftimestamp%3D20260305151545",
    "publishedDate": "2026-01-21",
    "publisher": "북로망스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-003",
    "externalId": "1171715501_9791171715503",
    "isbn": "9791171715503",
    "title": "죽은 왕녀를 위한 파반느(양장 특별판)",
    "authors": [
      "박민규"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7078406%3Ftimestamp%3D20260313130133",
    "publishedDate": "2025-11-19",
    "publisher": "위즈덤하우스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-004",
    "externalId": "1167376226_9791167376220",
    "isbn": "9791167376220",
    "title": "인터메초",
    "authors": [
      "샐리 루니"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7142464%3Ftimestamp%3D20260403154258",
    "publishedDate": "2026-02-05",
    "publisher": "은행나무",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-005",
    "externalId": "1193078709_9791193078709",
    "isbn": "9791193078709",
    "title": "아무도 오지 않는 곳에서",
    "authors": [
      "천선란"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7046640%3Ftimestamp%3D20260103152011",
    "publishedDate": "2025-10-27",
    "publisher": "허블",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-006",
    "externalId": "1168343100_9791168343108",
    "isbn": "9791168343108",
    "title": "양면의 조개껍데기",
    "authors": [
      "김초엽"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7001850%3Ftimestamp%3D20260110151931",
    "publishedDate": "2025-08-27",
    "publisher": "래빗홀",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-007",
    "externalId": "1172634009_9791172634001",
    "isbn": "9791172634001",
    "title": "윤슬의 바다",
    "authors": [
      "백은별"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6934332%3Ftimestamp%3D20251204150853",
    "publishedDate": "2025-05-31",
    "publisher": "바른북스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-008",
    "externalId": "8965823145_9788965823148",
    "isbn": "9788965823148",
    "title": "중고생이 꼭 읽어야 할 한국단편소설 50",
    "authors": [
      "김동인"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5851283%3Ftimestamp%3D20260310123238",
    "publishedDate": "2021-10-01",
    "publisher": "리베르스쿨",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-009",
    "externalId": "8936457381_9788936457389",
    "isbn": "9788936457389",
    "title": "시티 보이즈",
    "authors": [
      "정보훈"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6981304%3Ftimestamp%3D20260326131419",
    "publishedDate": "2025-07-25",
    "publisher": "창비",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-010",
    "externalId": "8957753354_9788957753354",
    "isbn": "9788957753354",
    "title": "포기할 자유",
    "authors": [
      "이재구"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6895205%3Ftimestamp%3D20250718143627",
    "publishedDate": "2025-04-21",
    "publisher": "아마존북스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-011",
    "externalId": "1168340942_9791168340947",
    "isbn": "9791168340947",
    "title": "저주토끼",
    "authors": [
      "정보라"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6329715%3Ftimestamp%3D20251204150749",
    "publishedDate": "2025-09-10",
    "publisher": "래빗홀",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-012",
    "externalId": "8954680003_9788954680004",
    "isbn": "9788954680004",
    "title": "이토록 평범한 미래",
    "authors": [
      "김연수"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6170593%3Ftimestamp%3D20260204151217",
    "publishedDate": "2022-10-07",
    "publisher": "문학동네",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-013",
    "externalId": "8949123495_9788949123493",
    "isbn": "9788949123493",
    "title": "순례 주택",
    "authors": [
      "유은실"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5619291%3Ftimestamp%3D20260314121655",
    "publishedDate": "2023-08-24",
    "publisher": "비룡소",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-014",
    "externalId": "8954692524_9788954692526",
    "isbn": "9788954692526",
    "title": "각각의 계절",
    "authors": [
      "권여선"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6341978%3Ftimestamp%3D20250716143656",
    "publishedDate": "2023-05-07",
    "publisher": "문학동네",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-015",
    "externalId": "1190090015_9791190090018",
    "isbn": "9791190090018",
    "title": "우리가 빛의 속도로 갈 수 없다면",
    "authors": [
      "김초엽"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F4966995%3Ftimestamp%3D20260307114601",
    "publishedDate": "2019-06-24",
    "publisher": "허블",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-016",
    "externalId": "115816176X_9791158161767",
    "isbn": "9791158161767",
    "title": "이 지랄맞음이 쌓여 축제가 되겠지(리커버:K)",
    "authors": [
      "조승리"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6596349%3Ftimestamp%3D20250918142344",
    "publishedDate": "2024-03-29",
    "publisher": "달",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-017",
    "externalId": "1197647678_9791197647673",
    "isbn": "9791197647673",
    "title": "한 번뿐인 인생은 어떻게 살아야 하는가",
    "authors": [
      "박찬위"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6322053%3Ftimestamp%3D20251121151732",
    "publishedDate": "2023-03-30",
    "publisher": "하이스트",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-018",
    "externalId": "1159259771_9791159259777",
    "isbn": "9791159259777",
    "title": "오늘도 나아가는 중입니다(웨딩 에디션)",
    "authors": [
      "조민"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6441732%3Ftimestamp%3D20251002142401",
    "publishedDate": "2023-09-19",
    "publisher": "참새책방",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-019",
    "externalId": "1192559746_9791192559742",
    "isbn": "9791192559742",
    "title": "좋은 일이 오려고 그러나 보다(10만부 기념 행운 에디션)",
    "authors": [
      "박여름"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6401999%3Ftimestamp%3D20251126161132",
    "publishedDate": "2023-07-26",
    "publisher": "히읏",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-020",
    "externalId": "1197332677_9791197332678",
    "isbn": "9791197332678",
    "title": "벼랑 끝이지만 아직 떨어지진 않았어",
    "authors": [
      "소재원"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6571704%3Ftimestamp%3D20251021144230",
    "publishedDate": "2024-03-04",
    "publisher": "프롤로그",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-021",
    "externalId": "890128068X_9788901280684",
    "isbn": "9788901280684",
    "title": "찌그러져도 동그라미입니다",
    "authors": [
      "김창완"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6582392%3Ftimestamp%3D20260306123735",
    "publishedDate": "2024-03-28",
    "publisher": "웅진지식하우스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-022",
    "externalId": "1191891208_9791191891201",
    "isbn": "9791191891201",
    "title": "잘될 수밖에 없는 너에게",
    "authors": [
      "최서영"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6139308%3Ftimestamp%3D20251221132212",
    "publishedDate": "2022-08-18",
    "publisher": "북로망스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-023",
    "externalId": "8933872353_9788933872352",
    "isbn": "9788933872352",
    "title": "사랑을 무게로 안 느끼게",
    "authors": [
      "박완서"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6537413%3Ftimestamp%3D20251203152429",
    "publishedDate": "2024-01-22",
    "publisher": "세계사",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-024",
    "externalId": "1196617147_9791196617141",
    "isbn": "9791196617141",
    "title": "열 번 잘해도 한 번 실수로 무너지는 게 관계다",
    "authors": [
      "김다슬"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6258101%3Ftimestamp%3D20250521220828",
    "publishedDate": "2023-01-20",
    "publisher": "클라우디아",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-025",
    "externalId": "119424680X_9791194246800",
    "isbn": "9791194246800",
    "title": "삶이라는 완벽한 농담",
    "authors": [
      "이경규"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6850702%3Ftimestamp%3D20260310125057",
    "publishedDate": "2025-03-12",
    "publisher": "쌤앤파커스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-026",
    "externalId": "8936438867_9788936438869",
    "isbn": "9788936438869",
    "title": "아주 오랜만에 행복하다는 느낌",
    "authors": [
      "백수린"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6186421%3Ftimestamp%3D20251112152254",
    "publishedDate": "2022-10-14",
    "publisher": "창비",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-027",
    "externalId": "1170612598_9791170612599",
    "isbn": "9791170612599",
    "title": "오역하는 말들",
    "authors": [
      "황석희"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6910622%3Ftimestamp%3D20260401124345",
    "publishedDate": "2025-05-30",
    "publisher": "북다",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-028",
    "externalId": "1196394504_9791196394509",
    "isbn": "9791196394509",
    "title": "죽고 싶지만 떡볶이는 먹고 싶어",
    "authors": [
      "백세희"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1667224%3Ftimestamp%3D20260414110724",
    "publishedDate": "2018-06-20",
    "publisher": "흔",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-029",
    "externalId": "8933871551_9788933871553",
    "isbn": "9788933871553",
    "title": "모래알만 한 진실이라도",
    "authors": [
      "박완서"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5556823%3Ftimestamp%3D20260220120053",
    "publishedDate": "2022-06-30",
    "publisher": "세계사",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-030",
    "externalId": "1193289025_9791193289020",
    "isbn": "9791193289020",
    "title": "마시지 않을 수 없는 밤이니까요",
    "authors": [
      "정지아"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6435252%3Ftimestamp%3D20260120151023",
    "publishedDate": "2023-09-07",
    "publisher": "마이디어북스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-031",
    "externalId": "1198362847_9791198362841",
    "isbn": "9791198362841",
    "title": "경제신문이 말하지 않는 경제 이야기",
    "authors": [
      "임주영"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6525080%3Ftimestamp%3D20260310124742",
    "publishedDate": "2024-01-15",
    "publisher": "민들레북",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-032",
    "externalId": "1193282535_9791193282533",
    "isbn": "9791193282533",
    "title": "자본주의 시대에서 살아남기 위한 최소한의 경제 공부",
    "authors": [
      "김욱현"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F7089209%3Ftimestamp%3D20260305151550",
    "publishedDate": "2025-12-04",
    "publisher": "하이스트",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-033",
    "externalId": "117061003X_9791170610038",
    "isbn": "9791170610038",
    "title": "벌거벗은 세계사: 경제편",
    "authors": [
      "tvn<벌거벗은세계사>제작팀",
      "김두얼",
      "김봉중",
      "김종일",
      "남종국",
      "박구병"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6339054%3Ftimestamp%3D20260108151959",
    "publishedDate": "2023-04-28",
    "publisher": "교보문고",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-034",
    "externalId": "1198987634_9791198987631",
    "isbn": "9791198987631",
    "title": "세계 경제 지각 변동",
    "authors": [
      "박종훈"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6946934%3Ftimestamp%3D20260403154117",
    "publishedDate": "2025-06-27",
    "publisher": "글로퍼스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-035",
    "externalId": "1140704389_9791140704385",
    "isbn": "9791140704385",
    "title": "경제 읽어주는 남자의 15분 경제 특강",
    "authors": [
      "김광석"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6342104%3Ftimestamp%3D20251126161041",
    "publishedDate": "2023-05-15",
    "publisher": "더퀘스트",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-036",
    "externalId": "1191183335_9791191183337",
    "isbn": "9791191183337",
    "title": "경제기사 궁금증 300문 300답(2025)",
    "authors": [
      "곽해선"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6793990%3Ftimestamp%3D20260325153013",
    "publishedDate": "2024-12-20",
    "publisher": "혜다",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-037",
    "externalId": "1191183211_9791191183214",
    "isbn": "9791191183214",
    "title": "경제기사 궁금증 300문 300답(2023)",
    "authors": [
      "곽해선"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6271093%3Ftimestamp%3D20250925141601",
    "publishedDate": "2023-02-10",
    "publisher": "혜다",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-038",
    "externalId": "1155383931_9791155383933",
    "isbn": "9791155383933",
    "title": "경제금융용어 700선",
    "authors": [
      "한국은행 편집부"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5447608%3Ftimestamp%3D20260414115903",
    "publishedDate": "2020-08-18",
    "publisher": "한국은행",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-039",
    "externalId": "1191360997_9791191360998",
    "isbn": "9791191360998",
    "title": "경제수학, 위기의 편의점을 살려라!",
    "authors": [
      "김나영"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6571543%3Ftimestamp%3D20251112153237",
    "publishedDate": "2024-02-11",
    "publisher": "생각학교",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-040",
    "externalId": "8947547263_9788947547260",
    "isbn": "9788947547260",
    "title": "세금 내는 아이들",
    "authors": [
      "옥효진"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5736499%3Ftimestamp%3D20251112145336",
    "publishedDate": "2021-06-15",
    "publisher": "한경키즈(한국경제신문)",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-041",
    "externalId": "1162543264_9791162543269",
    "isbn": "9791162543269",
    "title": "보도 섀퍼 부의 레버리지",
    "authors": [
      "보도 섀퍼"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6272188%3Ftimestamp%3D20251127150939",
    "publishedDate": "2023-02-07",
    "publisher": "비즈니스북스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-042",
    "externalId": "8960519790_9788960519794",
    "isbn": "9788960519794",
    "title": "장하준의 경제학 레시피",
    "authors": [
      "장하준"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6312187%3Ftimestamp%3D20260111130001",
    "publishedDate": "2023-03-30",
    "publisher": "부키",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-043",
    "externalId": "1169850367_9791169850360",
    "isbn": "9791169850360",
    "title": "위기의 역사",
    "authors": [
      "오건영"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6385497%3Ftimestamp%3D20260220121432",
    "publishedDate": "2023-07-19",
    "publisher": "페이지2북스",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-044",
    "externalId": "896262270X_9788962622706",
    "isbn": "9788962622706",
    "title": "유전자 지배 사회",
    "authors": [
      "최정균"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F6618449%3Ftimestamp%3D20260228122039",
    "publishedDate": "2024-04-30",
    "publisher": "동아시아",
    "source": "KAKAO"
  },
  {
    "uuid": "mock-book-045",
    "externalId": "8993178690_9788993178692",
    "isbn": "9788993178692",
    "title": "지리의 힘",
    "authors": [
      "팀 마샬"
    ],
    "thumbnailUrl": "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1394098%3Ftimestamp%3D20260411110727",
    "publishedDate": "2016-08-10",
    "publisher": "사이",
    "source": "KAKAO"
  }
];

export const getMockBookByUuid = (uuid: string): BookSummary | undefined =>
  mockBooks.find(b => b.uuid === uuid);
