/**
 * Returns a date in yyyy-mm-dd format
 */
export const CurrentISODate = () => {
  return new Date().toISOString().split("T")[0];
};
