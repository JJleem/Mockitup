import { useState, useMemo } from "react";
import FieldRow from "./components/FieldRow";
import type { ViewMode } from "./types";
import {
  generateItemRecursive,
  generateTypescript,
  generateSQL,
} from "./services/generator";
import { highlightSyntax } from "./services/highlighter";
import { useFieldTree } from "./hooks/useFieldTree";
import { useQuotes } from "./hooks/useQuotes";

export default function App() {
  // Hooks
  useQuotes();
  const { fields, handleUpdate, handleRemove, handleAddChild, handleAddRoot } =
    useFieldTree([
      {
        id: "1",
        key: "body",
        type: "object",
        children: [
          {
            id: "1-1",
            key: "content",
            type: "object",
            children: [
              {
                id: "1-1-1",
                key: "user",
                type: "object",
                children: [
                  { id: "1-1-1-1", key: "name", type: "name" },
                  { id: "1-1-1-2", key: "gender", type: "male" },
                ],
              },
            ],
          },
        ],
      },
    ]);

  // States
  const [count, setCount] = useState(1);
  const [result, setResult] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("json");
  const [copied, setCopied] = useState(false);

  // Handlers
  const generateData = () => {
    const data = Array.from({ length: count }).map(() =>
      generateItemRecursive(fields)
    );
    setResult(JSON.stringify(data, null, 2));
  };

  const displayContent = useMemo(() => {
    if (!result) return "// 데이터를 구조화하고 생성하세요.";
    try {
      const jsonData = JSON.parse(result);
      if (viewMode === "json") return result;
      if (viewMode === "ts") return generateTypescript(fields);
      if (viewMode === "sql") return generateSQL(jsonData);
    } catch {
      return "Error parsing result";
    }
    return "";
  }, [result, viewMode, fields]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 flex flex-col md:flex-col  font-sans overflow-hidden">
      <div className="flex min-h-screen gap-6 font-sans p-5  overflow-hidden">
        {/* 왼쪽 패널: 구조 생성기 */}
        <div className="w-full md:w-5/12 flex flex-col gap-4">
          <header className="flex items-center gap-2 ">
            <img
              src={`${import.meta.env.BASE_URL}mockitup.png`}
              alt="mockitup logo"
              className="object-contain w-13 h-13 absolute"
            />
            <h1 className="text-xl font-bold text-gray-300 tracking-wide ml-14">
              Mockitup
            </h1>
          </header>
          <div className="bg-[#1e1e1e] p-5 rounded-xl border border-gray-700 shadow-2xl flex flex-col gap-4 h-[calc(100vh-100px)] overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <label className="text-sm font-bold text-gray-400">
                Rows Count
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="bg-gray-900 border border-gray-600 rounded px-3 py-1 w-24 text-right text-white"
              />
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  onAddChild={handleAddChild}
                />
              ))}
              <button
                onClick={handleAddRoot}
                className="w-full py-3 border border-dashed border-gray-600 text-gray-400 rounded hover:bg-gray-800 transition-colors text-sm mt-2 cursor-pointer"
              >
                + Add Root Field
              </button>
            </div>
            <button
              onClick={generateData}
              // 로딩 중이면 버튼 비활성화 (선택 사항)
              // disabled={isLoading}
              className="relative w-full bg-gray-800 border border-gray-600 hover:bg-gray-900 font-bold py-3 rounded-lg shadow-lg cursor-pointer text-blue-500 overflow-hidden transition-all"
            >
              {/* 1. 텍스트: z-10으로 설정하여 스피너보다 위에 오게 함 */}
              <span className="relative z-10">Generate Structure</span>

              {/* 2. 스피너: 버튼 영역을 가득 채우고(inset-0), 중앙 정렬 */}
              {/* isLoading 상태일 때만 보여주려면 조건문 추가: {isLoading && (...)} */}
              <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
                {/* 스피너 크기를 버튼에 맞게 조절하거나, 은은하게 보이도록 opacity 적용 */}
                {/* <LoadingSpinner iconWidth={20} iconHeight={20} /> */}
              </div>
            </button>
          </div>
        </div>
        {/* 오른쪽 패널: 결과 뷰어 */}
        <div className="w-full md:w-7/12 flex flex-col gap-3">
          <div className="flex justify-between items-center bg-[#1e1e1e] p-2 rounded-lg border border-gray-700">
            <div className="flex gap-1">
              {(["json", "ts", "sql"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all uppercase cursor-pointer ${
                    viewMode === mode
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            {result && (
              <button
                onClick={copyToClipboard}
                className={`text-xs px-4 py-1.5 rounded-md font-bold transition-all ${
                  copied ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            )}
          </div>
          <div className="relative w-full h-[calc(100vh-100px)] font-mono text-sm border border-gray-700 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl">
            <pre
              className="absolute inset-0 p-6 whitespace-pre-wrap break-all overflow-auto text-gray-400 custom-scrollbar"
              dangerouslySetInnerHTML={{
                __html: highlightSyntax(displayContent, viewMode),
              }}
            />
          </div>
        </div>
      </div>
      <footer className="w-full py-6 mt-10 border-t border-gray-800 text-center flex">
        <img
          src={`${import.meta.env.BASE_URL}mockitup.png`}
          alt="mockitup logo"
          className="object-contain w-18 h-18 "
        />
        <div className="flex flex-col items-center justify-center gap-2 w-full -ml-18">
          {/* 1. 프로젝트 이름 & 라이선스 */}
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-gray-300 font-bold">mockitup</span>. Released
            under the{" "}
            <a
              href="https://github.com/님아이디/mockitup/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-blue-400"
            >
              MIT License
            </a>
            .
          </p>

          {/* 2. Github 링크 & 제작자 */}
          <div className="flex gap-4 text-sm text-gray-500">
            <a
              href="https://github.com/jjleem/mockitup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {/* Github SVG Icon */}
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub Repository
            </a>

            <span>|</span>

            <a
              href="https://github.com/jjleem"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5 justify-center"
            >
              Built by{" "}
              <span>
                <img
                  src={`${import.meta.env.BASE_URL}molt.png`}
                  alt=""
                  className="w-5"
                />
              </span>{" "}
              <span className="text-blue-400">Molt</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
