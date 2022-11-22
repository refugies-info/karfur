import React from "react";
import { HeaderContentProps } from "./HeaderContentProps";

export interface HeaderContentEmptyProps extends HeaderContentProps {}

const HeaderContentEmpty = ({}: HeaderContentProps) => <></>;

export default HeaderContentEmpty;
