// @ts-nocheck
import { UserContributionsComponent } from "../UserContributions.component";
import { initialMockStore } from "../../../../__fixtures__/reduxStore";
import { wrapWithProvidersAndRender } from "../../../../../jest/lib/wrapWithProvidersAndRender";

describe("userContributions", () => {
  it("should render correctly when loading", () => {
    window.scrollTo = jest.fn();

    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
      reduxState: {
        ...initialMockStore,
        loadingStatus: { FETCH_USER_CONTRIBUTIONS: { isLoading: true } },
      },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("should render correctly when 0 contributions", () => {
    window.scrollTo = jest.fn();
    const component = wrapWithProvidersAndRender({
      Component: UserContributionsComponent,
    });

    expect(component.toJSON()).toMatchSnapshot();
  });
});
