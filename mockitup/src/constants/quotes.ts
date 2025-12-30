import type { QuoteData } from "../types";

export const INTERNAL_QUOTES: QuoteData[] = [
  { quote: "삶이 있는 한 희망은 있다", author: "키케로" },
  { quote: "산다는 것 그것은 치열한 전투이다", author: "로망로랑" },
  {
    quote: "하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다",
    author: "사무엘존슨",
  },
  {
    quote: "언제나 현재에 집중할 수 있다면 행복할 것이다",
    author: "파울로 코엘료",
  },
  { quote: "신은 용기있는자를 결코 버리지 않는다", author: "켄러" },
  { quote: "피할수 없으면 즐겨라", author: "로버트 엘리엇" },
  {
    quote: "행복한 삶을 살기위해 필요한 것은 거의 없다",
    author: "마르쿠스 아우렐리우스",
  },
  { quote: "절대 어제를 후회하지 마라", author: "L.론허바드" },
  {
    quote: "한번의 실패와 영원한 실패를 혼동하지 마라",
    author: "F.스콧 핏제랄드",
  },
  { quote: "1퍼센트의 가능성, 그것이 나의 길이다", author: "나폴레옹" },
];

// 런타임에 API 등을 통해 추가될 수 있는 명언 배열
export const ACTIVE_QUOTES: QuoteData[] = [...INTERNAL_QUOTES];

export const addQuotes = (newQuotes: QuoteData[]) => {
  ACTIVE_QUOTES.push(...newQuotes);
};
