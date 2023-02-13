import React, { useContext } from "react";
import { useFormContext } from "react-hook-form";
import PageContext from "utils/pageContext";

interface Props {
  id: string;
  value: string;
}

const RichTextInput = (props: Props) => {
  const pageContext = useContext(PageContext);
  const { register } = useFormContext();

  return <>{pageContext.mode !== "edit" ? props.value : <textarea {...register(props.id)} />}</>;
};

export default RichTextInput;
