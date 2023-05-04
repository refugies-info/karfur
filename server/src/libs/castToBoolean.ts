export const castToBoolean = (value: string | boolean): boolean => {
  if (!value) return false;
  return value === "true";
};
