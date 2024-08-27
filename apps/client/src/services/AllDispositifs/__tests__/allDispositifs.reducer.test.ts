import { setAllDispositifsActionsCreator } from "../allDispositifs.actions";
import { allDispositifsReducer, initialAllDispositifsState } from "../allDispositifs.reducer";

const dispositifs = [{ _id: "id1" }, { _id: "id2" }];
describe("all dispositifs reducer", () => {
  it("should set dispositifs in store when action SET_ALL_DISPOSITIFS is received with payload", () => {
    expect(
      allDispositifsReducer(
        initialAllDispositifsState,
        // @ts-ignore
        setAllDispositifsActionsCreator(dispositifs),
      ),
    ).toEqual(dispositifs);
  });
});
