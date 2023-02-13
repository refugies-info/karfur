import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import PageContext from "utils/pageContext";

interface Props {
  id: string;
  value: string;
}

const TextInput = (props: Props) => {
  const pageContext = useContext(PageContext);
  const { register } = useFormContext();

  return <>{pageContext.mode !== "edit" ? props.value : <input type="text" {...register(props.id)} />}</>;
};

export default TextInput;
