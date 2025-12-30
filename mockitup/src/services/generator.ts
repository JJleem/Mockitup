import type { Field } from "../types";
import { DATA_TYPES } from "./dataRegistry";

// 1. 재귀적 데이터(JSON) 생성
export const generateItemRecursive = (
  fields: Field[]
): Record<string, unknown> => {
  const item: Record<string, unknown> = {};

  // 1차 패스: 일반 데이터 생성
  fields.forEach((field) => {
    const keyName = field.key.trim() || "unknown";
    if (field.type === "object" && field.children) {
      item[keyName] = generateItemRecursive(field.children);
    } else if (field.type !== "email") {
      item[keyName] = DATA_TYPES[field.type].generate(item, fields);
    }
  });

  // 2차 패스: 이메일 등 의존성 데이터 생성
  fields.forEach((field) => {
    if (field.type === "email") {
      const keyName = field.key.trim() || "unknown";
      item[keyName] = DATA_TYPES[field.type].generate(item, fields);
    }
  });

  return item;
};

// 2. TypeScript 인터페이스 생성
export const generateTypescript = (fields: Field[]): string => {
  if (!fields || fields.length === 0) return "";

  const parseFields = (
    currentFields: Field[],
    indent: string = "  "
  ): string => {
    let ts = "{\n";

    currentFields.forEach((field) => {
      const keyName = field.key.trim() || "unknown";
      const config = DATA_TYPES[field.type];
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(keyName)
        ? keyName
        : `"${keyName}"`;

      const isOptional = config.tsType === "undefined";
      const typeStr = config.tsType === "undefined" ? "any" : config.tsType;

      if (field.type === "object" && field.children) {
        ts += `${indent}${safeKey}: ${parseFields(
          field.children,
          indent + "  "
        )};\n`;
      } else {
        ts += `${indent}${safeKey}${isOptional ? "?" : ""}: ${typeStr};\n`;
      }
    });

    ts += `${indent.slice(0, -2)}}`;
    return ts;
  };

  return `export interface GeneratedData ${parseFields(fields)}`;
};

// 3. SQL INSERT 문 생성
export const generateSQL = (jsonData: Record<string, unknown>[]): string => {
  if (!jsonData || jsonData.length === 0) return "";
  const table = "MOCK_DATA";
  const keys = Object.keys(jsonData[0]);
  const columns = keys.join(", ");
  let sql = "";

  jsonData.forEach((row) => {
    const values = keys
      .map((key) => {
        const val = row[key];
        if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === "object" && val !== null)
          return `'${JSON.stringify(val)}'`;
        return val;
      })
      .join(", ");
    sql += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
  });
  return sql;
};
