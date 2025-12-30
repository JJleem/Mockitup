import { useState, useCallback } from "react";
import type { Field } from "../types";

const updateFieldRecursive = (
  list: Field[],
  id: string,
  key: string,
  val: Field[keyof Field]
): Field[] => {
  return list.map((f) => {
    if (f.id === id) {
      if (key === "type" && val === "object" && !f.children)
        return { ...f, [key]: val, children: [] };
      return { ...f, [key]: val };
    }
    if (f.children)
      return {
        ...f,
        children: updateFieldRecursive(f.children, id, key, val),
      };
    return f;
  });
};

const removeFieldRecursive = (list: Field[], id: string): Field[] => {
  return list
    .filter((f) => f.id !== id)
    .map((f) => ({
      ...f,
      children: f.children ? removeFieldRecursive(f.children, id) : undefined,
    }));
};

const addChildRecursive = (list: Field[], parentId: string): Field[] => {
  return list.map((f) => {
    if (f.id === parentId)
      return {
        ...f,
        children: [
          ...(f.children || []),
          { id: crypto.randomUUID(), key: "", type: "text" },
        ],
      };
    if (f.children)
      return { ...f, children: addChildRecursive(f.children, parentId) };
    return f;
  });
};

export const useFieldTree = (initialFields: Field[]) => {
  const [fields, setFields] = useState<Field[]>(initialFields);

  // ✅ 헬퍼 함수들이 외부에 있으므로 의존성 배열([])을 비워도 안전합니다.
  const handleUpdate = useCallback(
    (id: string, key: keyof Field, val: Field[keyof Field]) =>
      setFields((prev) => updateFieldRecursive(prev, id, key, val)),
    []
  );

  const handleRemove = useCallback(
    (id: string) => setFields((prev) => removeFieldRecursive(prev, id)),
    []
  );

  const handleAddChild = useCallback(
    (parentId: string) =>
      setFields((prev) => addChildRecursive(prev, parentId)),
    []
  );

  const handleAddRoot = useCallback(
    () =>
      setFields((prev) => [
        ...prev,
        { id: crypto.randomUUID(), key: "", type: "text" },
      ]),
    []
  );

  return { fields, handleUpdate, handleRemove, handleAddChild, handleAddRoot };
};
