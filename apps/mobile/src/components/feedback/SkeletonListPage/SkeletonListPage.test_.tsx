import { render } from "../../utils/tests";
import SkeletonListPage from "./SkeletonListPage";

describe("SkeletonListPage snapshot test suite", () => {
  it("should render without bug", () => {
    const test = render(<SkeletonListPage />);
    expect(test).toMatchSnapshot();
  });
});
