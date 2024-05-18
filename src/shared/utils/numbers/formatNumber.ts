export const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
  } else {
    return num.toString();
  }
};
