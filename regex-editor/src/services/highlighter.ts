import type { ViewMode } from "../types";

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const highlightSyntax = (code: string, mode: ViewMode): string => {
  if (mode === "json") {
    return code.replace(
      /("(?:\\[\s\S]|[^"])*"(?=\s*:))|("(?:\\[\s\S]|[^"])*")|(\b(?:true|false|null)\b)|(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|([{}[\],])/g,
      (match, key, str, bool, num, punc) => {
        if (key)
          return `<span class="text-[#9cdcfe]">${escapeHtml(key)}</span>`;
        if (str)
          return `<span class="text-[#ce9178]">${escapeHtml(str)}</span>`;
        if (bool)
          return `<span class="text-[#569cd6] font-bold">${bool}</span>`;
        if (num) return `<span class="text-[#b5cea8]">${num}</span>`;
        if (punc)
          return `<span class="text-[#ffd700]">${escapeHtml(punc)}</span>`;
        return escapeHtml(match);
      }
    );
  }

  if (mode === "sql") {
    return escapeHtml(code).replace(
      /('(?:\\[\s\S]|[^'])*')|(\b(?:INSERT|INTO|VALUES|NULL)\b)|(\b\d+\b)|([(),;])|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)/gi,
      (match, str, keyword, number, punctuation, identifier) => {
        if (str) return `<span class="text-[#ce9178]">${str}</span>`;
        if (keyword)
          return `<span class="text-[#569cd6] font-bold">${keyword}</span>`;
        if (number) return `<span class="text-[#b5cea8]">${number}</span>`;
        if (punctuation)
          return `<span class="text-[#ffd700]">${punctuation}</span>`;
        if (identifier) return `<span class="text-white">${identifier}</span>`;
        return match;
      }
    );
  }

  if (mode === "ts") {
    let html = escapeHtml(code);
    html = html.replace(
      /\b(export|default|return|interface|type)\b/g,
      '<span class="text-[#c586c0] font-bold">$1</span>'
    );
    html = html.replace(
      /\b(interface)\b/g,
      '<span class="text-[#5787f0] font-bold">$1</span>'
    );
    html = html.replace(
      /\b(string|number|boolean|any|void|null|undefined|RegisterUserData|GeneratedData)\b/g,
      '<span class="text-[#4ec9b0]">$1</span>'
    );
    html = html.replace(
      /([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\??\s*:)/g,
      '<span class="text-[#9cdcfe]">$1</span>'
    );
    html = html.replace(/[{}]/g, '<span class="text-[#ffd700]">$&</span>');
    return html;
  }
  return escapeHtml(code);
};
