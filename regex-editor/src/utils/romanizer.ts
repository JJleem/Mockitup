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
  "g",
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

export const romanize = (text: string): string => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      const cho = Math.floor(code / 588);
      const jung = Math.floor((code - cho * 588) / 28);
      const jong = code % 28;
      result += CHOSUNG[cho] + JUNGSUNG[jung] + JONGSUNG[jong];
    } else {
      result += text.charAt(i);
    }
  }
  return result.toLowerCase();
};
