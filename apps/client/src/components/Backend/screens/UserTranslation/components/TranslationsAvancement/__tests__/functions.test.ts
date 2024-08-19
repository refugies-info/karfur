import { filterData } from "../functions";
import { data, data1, data2, data3, data4, data5, data6, data7, data8 } from "../../__fixtures__/dispositifs";
import { ContentType, TraductionsStatus } from "@refugies-info/api-types";

describe("filter data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", true, "all", "");
    expect(result).toEqual({
      dataToDisplay: data,
      nbARevoir: 2,
      nbATraduire: 2,
      nbAValider: 2,
      nbPubliees: 2,
      nbDispositifs: 4,
      nbDemarches: 4,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", false, "all", "");
    expect(result).toEqual({
      dataToDisplay: [data1, data2, data6, data7],
      nbARevoir: 0,
      nbATraduire: 2,
      nbAValider: 0,
      nbPubliees: 2,
      nbDispositifs: 2,
      nbDemarches: 2,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, TraductionsStatus.TO_REVIEW, true, "all", "");
    expect(result).toEqual({
      dataToDisplay: [data3, data4],
      nbARevoir: 2,
      nbATraduire: 2,
      nbAValider: 2,
      nbPubliees: 2,
      nbDispositifs: 1,
      nbDemarches: 1,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, TraductionsStatus.VALIDATED, false, ContentType.DISPOSITIF, "");
    expect(result).toEqual({
      dataToDisplay: [data6],
      nbARevoir: 0,
      nbATraduire: 2,
      nbAValider: 0,
      nbPubliees: 2,
      nbDispositifs: 1,
      nbDemarches: 1,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", false, ContentType.DISPOSITIF, "tif6");
    expect(result).toEqual({
      dataToDisplay: [data6],
      nbARevoir: 0,
      nbATraduire: 0,
      nbAValider: 0,
      nbPubliees: 1,
      nbDispositifs: 1,
      nbDemarches: 0,
    });
  });

  it("should return correct data ", () => {
    const result = filterData(data, "all", true, ContentType.DISPOSITIF, "Marqué");
    expect(result).toEqual({
      dataToDisplay: [data1, data3, data6, data8],
      nbARevoir: 1,
      nbATraduire: 1,
      nbAValider: 1,
      nbPubliees: 1,
      nbDispositifs: 4,
      nbDemarches: 0,
    });
  });
});
