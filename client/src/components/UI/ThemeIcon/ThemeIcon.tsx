import React from "react";
import Image from "next/image";
import { Theme } from "types/interface";

interface Props {
  theme: Theme | undefined | null;
  size?: number;
}

const ThemeIcon = (props: Props) =>
  props.theme ? (
    <Image src={props.theme.icon.secure_url} width={props.size || 22} height={props.size || 22} alt="" />
  ) : null;

export default ThemeIcon;
