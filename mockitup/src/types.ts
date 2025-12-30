/* eslint-disable @typescript-eslint/no-explicit-any */
// 공통 타입 정의
export type DataTypeKey =
  | "object"
  | "name"
  | "male"
  | "real_image"
  | "icon"
  | "email"
  | "text"
  | "text_null"
  | "job"
  | "address"
  | "phone"
  | "uuid"
  | "number"
  | "number1000"
  | "number_null"
  | "boolean"
  | "date"
  | "0|1"
  | "Array_String"
  | "Array_Number"
  | "quote"
  | "only_null"
  | "only_undefined";

export interface Field {
  id: string;
  key: string;
  type: DataTypeKey;
  children?: Field[];
}

export interface QuoteData {
  quote: string;
  author: string;
}

export type ViewMode = "json" | "ts" | "sql";

export interface DataTypeConfig {
  label: string;
  tsType: string;
  generate: (item?: Record<string, any>, fields?: Field[]) => any;
}
