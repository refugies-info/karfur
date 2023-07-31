import { cls } from "./classname";

describe("classname", () => {
  it("should join classes", () => {
    const res = cls("test1", "test2", "test3");
    expect(res).toEqual("test1 test2 test3");
  });

  it("remove booleans", () => {
    const res = cls("test1", false && "test2", true && "test3");
    expect(res).toEqual("test1 test3");
  });
});
