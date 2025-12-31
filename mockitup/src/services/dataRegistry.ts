import { fakerKO as faker } from "@faker-js/faker";
// 🔥 [수정] Field 타입 추가 Import
import type { DataTypeKey, DataTypeConfig, Field } from "../types";
import { ACTIVE_QUOTES } from "../constants/quotes";
import { romanize } from "../utils/romanizer";

export const DATA_TYPES: Record<DataTypeKey, DataTypeConfig> = {
  object: { label: "📁 객체 (Object)", tsType: "object", generate: () => ({}) },
  name: {
    label: "👤 사람 이름",
    tsType: "string",
    generate: () => faker.person.fullName(),
  },
  male: {
    label: "🚻 성별",
    tsType: "string",
    generate: () => faker.person.sex(),
  },
  real_image: {
    label: "👨‍👩‍👦 사람 랜덤 이미지",
    tsType: "string",
    generate: () => faker.image.personPortrait(),
  },
  icon: {
    label: "🖼 랜덤 이미지",
    tsType: "string",
    generate: () => `https://picsum.photos/seed/${faker.string.uuid()}/500/300`,
  },
  email: {
    label: "📧 이메일 (Smart)",
    tsType: "string",
    generate: (item?: Record<string, unknown>, fields?: Field[]) => {
      const nameField = fields?.find((f) => f.type === "name");

      if (nameField && item && item[nameField.key]) {
        const korName = item[nameField.key];

        if (typeof korName === "string") {
          const korSurname = korName.substring(0, 1);
          const korFirstName = korName.substring(1);
          return faker.internet.email({
            firstName: romanize(korFirstName),
            lastName: romanize(korSurname),
          });
        }
      }
      return faker.internet.email();
    },
  },
  text: {
    label: "📝 단어",
    tsType: "string",
    generate: () => faker.word.sample(),
  },
  text_null: {
    label: "📝❓ 단어 또는 Null",
    tsType: "string | null",
    generate: () => faker.helpers.arrayElement([faker.word.sample(), null]),
  },
  job: {
    label: "💼 직업",
    tsType: "string",
    generate: () => faker.person.jobTitle(),
  },
  address: {
    label: "🏠 주소",
    tsType: "string",
    generate: () => faker.location.streetAddress({ useFullAddress: true }),
  },
  phone: {
    label: "📞 전화번호",
    tsType: "string",
    generate: () => faker.phone.number(),
  },
  uuid: {
    label: "🔑 UUID",
    tsType: "string",
    generate: () => faker.string.uuid(),
  },
  number: {
    label: "🔢 숫자 (1~100)",
    tsType: "number",
    generate: () => faker.number.int({ min: 1, max: 100 }),
  },
  number1000: {
    label: "🔢 숫자 (1,000~)",
    tsType: "number",
    generate: () => faker.number.int({ min: 1000, max: 100000 }),
  },
  number_null: {
    label: "🔢❓ 숫자 또는 Null",
    tsType: "number | null",
    generate: () =>
      faker.helpers.arrayElement([
        faker.number.int({ min: 1, max: 100 }),
        null,
      ]),
  },
  boolean: {
    label: "ox 불리언",
    tsType: "boolean",
    generate: () => faker.datatype.boolean(),
  },
  date: {
    label: "📅 날짜",
    tsType: "string",
    generate: () => faker.date.recent().toISOString().split("T")[0],
  },
  "0|1": {
    label: "0️⃣1️⃣ 0 또는 1",
    tsType: "0 | 1",
    generate: () => faker.helpers.arrayElement([0, 1]),
  },
  Array_String: {
    label: "🔤 문자열 배열",
    tsType: "string[]",
    generate: () => Array.from({ length: 3 }).map(() => faker.word.sample()),
  },
  Array_Number: {
    label: "🔢 숫자 배열",
    tsType: "number[]",
    generate: () =>
      Array.from({ length: 3 }).map(() =>
        faker.number.int({ min: 1, max: 100 })
      ),
  },
  quote: {
    label: "📜 명언 (Object)",
    tsType: "{ quote: string; author: string }",
    generate: () => faker.helpers.arrayElement(ACTIVE_QUOTES),
  },
  only_null: { label: "🚫 Null", tsType: "null", generate: () => null },
  only_undefined: {
    label: "❓ Undefined (TS: Optional)",
    tsType: "undefined",
    generate: () => undefined,
  },
};
