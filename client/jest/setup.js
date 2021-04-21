jest.mock("moment", () => {
  // Here we are able to mock chain builder pattern
  const mMoment = {
    format: jest.fn(() => "12/07/1998"),
    startOf: jest.fn().mockReturnThis(),
    isValid: jest.fn().mockReturnValue(true),
    diff: jest.fn().mockReturnValue(-5),
  };
  // Here we are able to mock the constructor and to modify instance methods
  const fn = jest.fn((newMoment) => {
    mMoment.format = jest.fn(() => newMoment);
    return mMoment;
  });

  return fn;
});

jest.mock("moment/min/moment-with-locales", () => {
  // Here we are able to mock chain builder pattern
  const mMoment = {
    format: jest.fn(() => "12/07/1998"),
    startOf: jest.fn().mockReturnThis(),
    isValid: jest.fn().mockReturnValue(true),
    diff: jest.fn().mockReturnValue(-5),
    locale: jest.fn(),
  };
  // Here we are able to mock the constructor and to modify instance methods
  const fn = jest.fn((newMoment) => {
    mMoment.format = jest.fn(() => newMoment);
    return mMoment;
  });
  fn.locale = jest.fn();

  return fn;
});

jest.mock("sweetalert2", () => ({
  __esModule: true, // this property makes it work
  default: { fire: jest.fn().mockResolvedValue("test") },
}));
