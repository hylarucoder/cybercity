import { GraphQLScalarType, Kind } from "graphql";
import { formatDate, formatDatetime } from "@/utils/time";
import dayjs from "dayjs";

export const TDate = new GraphQLScalarType({
  name: "Date",
  description: "date",
  serialize(value: unknown): string {
    return formatDate(value);
  },
  parseValue(value: unknown): Date {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dayjs(value).toDate();
  },
  parseLiteral(ast): Date {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dayjs(ast.value).toDate();
  },
});

export const TDateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "datetime",
  serialize(value: unknown): string {
    return formatDatetime(value);
  },
  parseValue(value: unknown): Date {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dayjs(value).toDate();
  },
  parseLiteral(ast): Date {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dayjs(ast.value).toDate();
  },
});
