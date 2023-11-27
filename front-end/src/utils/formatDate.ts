export const formatDateToLocale = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });
};
