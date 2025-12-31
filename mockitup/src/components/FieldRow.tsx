import { memo } from "react";
import type { Field } from "../types";
import { DATA_TYPES } from "../services/dataRegistry";

interface FieldRowProps {
  field: Field;
  depth?: number;
  onUpdate: (id: string, key: keyof Field, val: Field[keyof Field]) => void;
  onRemove: (id: string) => void;
  onAddChild: (id: string) => void;
}

const FieldRow = memo(
  ({ field, depth = 0, onUpdate, onRemove, onAddChild }: FieldRowProps) => {
    return (
      <div className="flex flex-col animate-fadeIn">
        <div
          className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2 pr-2"
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          {depth > 0 && (
            <div className="hidden sm:block w-4 h-4 border-l-2 border-b-2 border-gray-600 rounded-bl-lg mb-2 shrink-0" />
          )}
          <input
            type="text"
            placeholder="key (Only English)"
            value={field.key}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[a-zA-Z0-9_]*$/.test(val)) {
                onUpdate(field.id, "key", val);
              }
            }}
            className={`bg-gray-800 border ${
              depth === 0 ? "border-gray-600" : "border-blue-900"
            } rounded px-3 py-2 md:text-xs text-xs outline-none text-blue-300 font-mono focus:border-blue-500 
            transition-all
            w-full sm:w-auto sm:flex-2 min-w-30`}
          />
          <div className="flex gap-2 w-full sm:w-auto sm:flex-3 items-center min-w-30">
            <select
              value={field.type}
              onChange={(e) => onUpdate(field.id, "type", e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none text-gray-300 cursor-pointer
              w-full flex-1 md:text-xs"
            >
              {Object.entries(DATA_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onRemove(field.id)}
              className="text-gray-600 hover:text-red-400 p-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
        {field.type === "object" && (
          <div className="flex flex-col gap-2 relative">
            <div
              className="absolute left-4.5 top-0 bottom-4 w-px bg-gray-700"
              style={{ left: `${depth * 20 + 20}px` }}
            />
            {field.children?.map((child) => (
              <FieldRow
                key={child.id}
                field={child}
                depth={depth + 1}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onAddChild={onAddChild}
              />
            ))}
            <button
              onClick={() => onAddChild(field.id)}
              className="text-xs text-blue-400 hover:text-blue-300 text-left py-1 ml-2 border border-dashed border-gray-700 rounded px-2 w-fit mb-2 cursor-pointer"
              style={{ marginLeft: `${depth * 20 + 24}px` }}
            >
              + Add Property inside "{field.key || "object"}"
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default FieldRow;
