import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLangueModalActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { useRouter } from "next/router";
import { ToolItem } from "@dataesr/react-dsfr";

const LanguageToolItem = () => {
  const dispatch = useDispatch();
  const allLanguages = useSelector(allLanguesSelector);
  const router = useRouter();
  const current = (allLanguages || []).find((x) => x.i18nCode === router.locale) || null;
  const langueCode = allLanguages.length > 0 && current ? current.langueCode : "fr";

  const toggleLanguageModal = () => dispatch(toggleLangueModalActionCreator());

  return (
    <ToolItem icon={`flag-icon flag-icon-${langueCode}`} onClick={toggleLanguageModal}>
      {current ? current.langueLoc : "Langue"}
    </ToolItem>
  );
};

LanguageToolItem.defaultProps = {
  __TYPE: "ToolItem"
};

export default LanguageToolItem;
