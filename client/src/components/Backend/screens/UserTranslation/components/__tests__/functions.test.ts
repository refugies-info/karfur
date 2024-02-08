import { sortData } from "../functions";
import { data, data1, data2, data3, data4, data5, data6, data7, data8 } from "../__fixtures__/dispositifs";

describe("sortData", () => {
  it("should sort data", () => {
    const result = sortData(data, { name: "none", order: "", sens: "up" });
    expect(result).toEqual(data);
  });

  it("should sort data", () => {
    const result = sortData([data6, data7], {
      name: "typeContenu",
      order: "typeContenu",
      sens: "up",
    });
    expect(result).toEqual([data7, data6]);
  });

  it("should sort data", () => {
    const result = sortData([data1, data4], {
      name: "typeContenu",
      order: "typeContenu",
      sens: "down",
    });
    expect(result).toEqual([data1, data4]);
  });

  it("should sort data", () => {
    const result = sortData(data, {
      name: "nbMots",
      order: "nbMots",
      sens: "up",
    });
    expect(result).toEqual([
      data1,
      data2,
      data3,
      data4,
      data5,
      data6,
      data7,
      data8,
    ]);
  });

  it("should sort data", () => {
    const result = sortData(data, {
      name: "nbMots",
      order: "nbMots",
      sens: "down",
    });
    expect(result).toEqual([
      data8,
      data7,
      data6,
      data5,
      data4,
      data3,
      data2,
      data1,
    ]);
  });
});
