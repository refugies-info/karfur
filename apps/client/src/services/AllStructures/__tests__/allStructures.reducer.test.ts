import { setAllStructuresActionCreator } from "../allStructures.actions";
import { allStructuresReducer, initialAllStructuresState } from "../allStructures.reducer";

const structures = [{ _id: "id1" }, { _id: "id2" }];
describe("all structures reducer", () => {
  it("should set structures in store when action SET_ALL_DISPOSITIFS is received with payload", () => {
    expect(
      allStructuresReducer(
        initialAllStructuresState,
        // @ts-ignore
        setAllStructuresActionCreator(structures),
      ),
    ).toEqual(structures);
  });
});
