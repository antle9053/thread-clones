import moment from "moment";

export const formatFromNow = (time: Date): string => {
  return moment(time).fromNow();
};
