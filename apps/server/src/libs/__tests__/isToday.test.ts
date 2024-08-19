import { isToday } from "../isToday";

describe("isToday", () => {
  it('should return true when given date is today\'s date', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('should return false when given date is not today\'s date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('should return false when given date is undefined', () => {
    expect(isToday(undefined)).toBe(false);
  });

  it('should return false when given date is a future date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });

  it('should return false when given date is a past date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it('should return false when given date is a date from a different month', () => {
    const differentMonth = new Date();
    differentMonth.setMonth(differentMonth.getMonth() - 1);
    expect(isToday(differentMonth)).toBe(false);
  });
});
