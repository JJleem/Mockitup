import { useEffect } from "react";
import { addQuotes } from "../constants/quotes";
import type { QuoteData } from "../types";

// 1. API 응답 타입을 정의합니다.
interface AdviceApiResponse {
  message: string;
  author: string;
  authorProfile?: string; // API 응답에 포함될 수 있는 다른 필드들
}

export const useQuotes = () => {
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const promises = Array.from({ length: 5 }).map(() =>
          fetch("https://korean-advice-open-api.vercel.app/api/advice").then(
            (res) => res.json()
          )
        );

        // results는 AdviceApiResponse들의 배열이라고 추론되거나 단언할 수 있습니다.
        const results = await Promise.all(promises);

        // 2. map의 인자(item)에 any 대신 구체적인 타입을 지정합니다.
        const newQuotes: QuoteData[] = results.map(
          (item: AdviceApiResponse) => ({
            quote: item.message,
            author: item.author,
          })
        );

        addQuotes(newQuotes);
      } catch (error) {
        // 3. error 변수를 콘솔에 함께 출력하여 '사용되지 않음' 에러를 해결하고 디버깅 정보를 확보합니다.
        console.warn("⚠️ API 로드 실패", error);
      }
    };
    fetchQuotes();
  }, []);
};
