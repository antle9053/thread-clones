import moment from "moment";

export const formatFromNow = (time: Date): string => {
  return moment(time)
    .fromNow()
    .replace(" ago", "")
    .replace(" hour", "h")
    .replace(" hours", "h")
    .replace(" days", "d")
    .replace(" day", "d");
};
