// 한글 이름 -> 영문 변환 유틸리티

const CHOSUNG = [
  "g",
  "kk",
  "n",
  "d",
  "tt",
  "r",
  "m",
  "b",
  "pp",
  "s",
  "ss",
  "",
  "j",
  "jj",
  "ch",
  "k",
  "t",
  "p",
  "h",
];

const JUNGSUNG = [
  "a",
  "ae",
  "ya",
  "yae",
  "eo",
  "e",
  "yeo",
  "ye",
  "o",
  "wa",
  "wae",
  "oe",
  "yo",
  "u",
  "wo",
  "we",
  "wi",
  "yu",
  "eu",
  "yi",
  "i",
];

const JONGSUNG = [
  "",
  "k",
  "kk",
  "ks",
  "n",
  "nj",
  "nh",
  "d",
  "l",
  "lg",
  "lm",
  "lb",
  "ls",
  "lt",
  "lp",
  "lh",
  "m",
  "b",
  "bs",
  "s",
  "ss",
  "ng",
  "j",
  "ch",
  "k",
  "t",
  "p",
  "h",
];

const SPECIAL_CASES: Record<string, string> = {
  오: "oh",
  우: "woo",
  이: "lee",
  김: "kim",
  박: "park",
  최: "choi",
  임: "lim",
};

export const romanize = (text: string): string => {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);

    // 1. 예외 케이스(SPECIAL_CASES)에 있는지 먼저 확인
    if (SPECIAL_CASES[char]) {
      result += SPECIAL_CASES[char];
      continue;
    }

    // 2. 일반 로직 수행
    const code = text.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      const cho = Math.floor(code / 588);
      const jung = Math.floor((code - cho * 588) / 28);
      const jong = code % 28;
      result += CHOSUNG[cho] + JUNGSUNG[jung] + JONGSUNG[jong];
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
};
