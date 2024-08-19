// @ts-nocheck
import formatPhoneNumber from "../formatPhoneNumber";

const resPhoneNumber = "0607080910";

describe("formatPhoneNumber", () => {
  it("should return identical number", () => {
    const res = formatPhoneNumber(resPhoneNumber);
    expect(res).toEqual(resPhoneNumber);
  });
  it("should remove spaces", () => {
    const res = formatPhoneNumber("06 07 08 09 10");
    expect(res).toEqual(resPhoneNumber);
  });
  it("should replace +33", () => {
    const res = formatPhoneNumber("+33607080910");
    expect(res).toEqual(resPhoneNumber);
  });
  it("should replace 0033", () => {
    const res = formatPhoneNumber("0033607080910");
    expect(res).toEqual(resPhoneNumber);
  });
  it("should remove dots", () => {
    const res = formatPhoneNumber("+336.07.08.09.10");
    expect(res).toEqual(resPhoneNumber);
  });
  it("should remove hyphens", () => {
    const res = formatPhoneNumber("+336-07-08-09-10");
    expect(res).toEqual(resPhoneNumber);
  });
  it("should raise an error", () => {
    expect(() => {
      formatPhoneNumber("003360708091")
    }).toThrow("Phone number length invalid");
  });
});
