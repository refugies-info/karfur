import { SelectedDispositifState } from "@/services/SelectedDispositif/selectedDispositif.reducer";
import { selectedDispositifSelector } from "@/services/SelectedDispositif/selectedDispositif.selector";
import { ContentType } from "@refugies-info/api-types";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

const getContentType = (dispositif: SelectedDispositifState, formTypeContenu: ContentType | undefined) => {
  if (dispositif?.typeContenu) {
    return dispositif?.typeContenu;
  } else if (formTypeContenu) {
    return formTypeContenu;
  }
  return ContentType.DISPOSITIF;
};

/**
 * Initializes the dispositif forms, and return the form context methods
 */
const useContentType = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const typeContenu: ContentType | undefined = useWatch({ name: "typeContenu" });
  const [contentType, setContentType] = useState<ContentType>(getContentType(dispositif, typeContenu));

  useEffect(() => {
    setContentType(getContentType(dispositif, typeContenu));
  }, [dispositif, typeContenu]);

  return contentType;
};

export default useContentType;
