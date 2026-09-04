import { getChangedMetadatasLabels } from "../dispositif.business";

describe("getChangedMetadatasLabels", () => {
  it("returns an empty list when nothing changed", () => {
    const metadatas = { price: { values: [0] }, location: ["56 - Morbihan"] };
    expect(getChangedMetadatasLabels(metadatas, { ...metadatas })).toEqual([]);
  });

  it("returns the label of a changed nested field", () => {
    expect(
      getChangedMetadatasLabels({ price: { values: [0] } }, { price: { values: [42] } }),
    ).toEqual(["Prix"]);
  });

  it("returns every changed label, in schema order", () => {
    const changed = getChangedMetadatasLabels(
      { location: ["56 - Morbihan"], price: { values: [0] }, timeSlots: ["tuesday"] },
      { location: ["56 - Morbihan", "75 - Paris"], price: { values: [0] }, timeSlots: [] },
    );
    expect(changed).toEqual(["Lieux", "Créneaux horaires"]);
  });

  it("detects an added or removed field", () => {
    expect(getChangedMetadatasLabels({}, { conditions: ["cir"] })).toEqual(["Conditions"]);
    expect(getChangedMetadatasLabels({ conditions: ["cir"] }, {})).toEqual(["Conditions"]);
  });

  it("treats null and undefined as equal", () => {
    expect(getChangedMetadatasLabels({ age: null }, {})).toEqual([]);
  });

  it("ignores key ordering inside nested objects", () => {
    expect(
      getChangedMetadatasLabels(
        { age: { type: "between", ages: [16, 64] } },
        { age: { ages: [16, 64], type: "between" } },
      ),
    ).toEqual([]);
  });

  it("handles missing metadatas", () => {
    expect(getChangedMetadatasLabels(undefined, undefined)).toEqual([]);
    expect(getChangedMetadatasLabels(undefined, { price: { values: [1] } })).toEqual(["Prix"]);
  });

  it("falls back to the raw key for a field without label", () => {
    expect(getChangedMetadatasLabels({}, { newField: "x" } as any)).toEqual(["newField"]);
  });
});
