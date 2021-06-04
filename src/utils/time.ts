import dayjs from "dayjs";

export function getDateOffset(datetime, days = 0) {
  return dayjs(datetime).add(days, "day");
}

export function formatTime(datetime) {
  return dayjs(datetime).format("HH:mm:ss");
}

export function formatDate(datetime) {
  return dayjs(datetime).format("YYYY-MM-DD");
}

export function formatDatetime(datetime) {
  return dayjs(datetime).format("YYYY-MM-DD HH:mm:ss");
}

const months = {
  "1": "一月",
  "2": "二月",
  "3": "三月",
  "4": "四月",
  "5": "五月",
  "6": "六月",
  "7": "七月",
  "8": "八月",
  "9": "九月",
  "10": "十月",
  "11": "十一月",
  "12": "十二月",
};

export function humanizeMonth(datetime) {
  return months[dayjs(datetime).format("M")];
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function formatWeekday(datetime): string {
  return weekdays[dayjs(datetime).toDate().getDay()];
}

/**
 * 2019-08-07 -> Date()
 */
export function parseDate(date) {
  return dayjs(date);
}

/**
 * 2019-08-07 12:00:00 -> Date()
 */
export function parseDateTime(datetime) {
  return dayjs(datetime);
}

/**
 * 2019-08-07 12:00:00 -> Date()
 */
export function parseTime(datetime) {
  return datetime;
}

/**
 * 几秒钟前 / 几小时前 / 几天前
 */
export function humanizeTime(time) {
  return time;
}

export function humanizeWeekday(datetime) {
  return weekdays[dayjs(datetime).toDate().getDay()];
}
