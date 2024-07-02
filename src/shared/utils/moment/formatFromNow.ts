import moment from "moment";

export const formatFromNow = (date: Date): string => {
  const now = moment();
  const inputDate = moment(date);
  const duration = moment.duration(now.diff(inputDate));

  const years = duration.years();
  if (years > 0) return years + "y";

  const months = duration.months();
  if (months > 0) return months + "mo";

  const weeks = Math.floor(duration.asWeeks());
  if (weeks > 0) return weeks + "w";

  const days = duration.days();
  if (days > 0) return days + "d";

  const hours = duration.hours();
  if (hours > 0) return hours + "h";

  const minutes = duration.minutes();
  if (minutes > 0) return minutes + "m";

  const seconds = duration.seconds();
  if (seconds > 0) return seconds + "s";

  return "Just now";
};
