export const castToBoolean = (value: String | null): boolean => {
  if (!value) return false;
  return value === "true";
};
