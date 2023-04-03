export default function getDateTimeFormat(
  payload: Date | string | undefined,
  type: "long" | "medium" | "short" = "medium"
) {
  if (payload === undefined) {
    return;
  }

  //long ==최대한 디테일, medium == second x short === 댓글에 씀
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "short",
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  };
  const mOptions: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "short",
    weekday: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  };
  const sOption: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "2-digit",
    hourCycle: "h23",
  };

  return new Intl.DateTimeFormat(
    "ko-KR",
    type === "long" ? options : type === "medium" ? mOptions : sOption
  ).format(new Date(payload));
}
