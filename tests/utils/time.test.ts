import "module-alias/register";
import * as moment from "moment";
import { formatDate, formatDatetime, formatTime, formatWeekday, getDateOffset } from "@/utils/time";
import { test } from "tap";

// if ("default" in moment) {
//   moment = moment["default"];
// }

test("format date && time && datetime", (t) => {
  t.plan(8)
  const date = moment("2018-08-08 01:01:01");
  t.equal(formatDate(date) == "2018-08-08",true);
  t.equal(formatTime(date) == "01:01:01",true);
  t.equal(formatDatetime(date) == "2018-08-08 01:01:01",true);
  t.equal(formatDate(getDateOffset(date, -1)) == "2018-08-07",true);
  t.equal(formatDate(getDateOffset(date, 2)) == "2018-08-10",true);

  const weekDate = moment("2019-11-18 01:01:01");
  const f = formatWeekday(weekDate)
  t.equal(formatWeekday(weekDate) === "周一",true);
  t.equal(formatWeekday(getDateOffset(weekDate, 1)) === "周二",true);
  t.equal(formatWeekday(getDateOffset(weekDate, 6)) === "周日",true);
});
