/**
 * Returns a date in yyyy-mm-dd format
 */
export const CurrentISODate = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Get the correct month number
 * @param {date} date
 */
export const getActualMonth = (date) => {
  // Add one, because getMonth is zero based
  return new Date(date).getMonth() + 1;
};

/**
 * Return an object with the month and the year of the given date
 * @param {date} date
 */
export const getQueryDateObject = (date) => {
  const month = getActualMonth(date);
  const year = new Date(date).getFullYear();
  return { month: month, year: year };
};
