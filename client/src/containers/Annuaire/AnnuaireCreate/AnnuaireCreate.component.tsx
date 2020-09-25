import React from "react";
import { Props } from "./AnnuaireCreate.container";

export interface PropsBeforeInjection {}

export const AnnuaireCreateComponent = (props: Props) => {
  console.log("props", props.structure && props.structure.acronyme);
  return <div>Hello</div>;
};
