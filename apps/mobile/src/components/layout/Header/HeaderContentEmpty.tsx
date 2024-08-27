import { HeaderContentProps } from "./HeaderContentProps";

export interface HeaderContentEmptyProps extends HeaderContentProps {}

const HeaderContentEmpty = ({}: HeaderContentProps) => <></>;
HeaderContentEmpty.displayName = "HeaderContentEmpty";

export default HeaderContentEmpty;
