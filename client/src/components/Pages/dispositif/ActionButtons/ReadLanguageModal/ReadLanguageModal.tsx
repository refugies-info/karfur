import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getPath, PathNames } from "routes";
import { useLocale } from "hooks";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import MobileModal from "components/Modals/MobileModal";
import LangueSelectList from "../../LangueSelectList";
import styles from "./ReadLanguageModal.module.scss";
import { Event } from "lib/tracking";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ReadLanguageModal = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const dispositif = useSelector(selectedDispositifSelector);
  const languages = useSelector(allLanguesSelector);
  const [selectedLn, setSelectedLn] = useState<string>(locale);

  useEffect(() => {
    if (locale !== selectedLn) {
      const { pathname, query } = router;
      router.push(
        {
          pathname: getPath(pathname as PathNames, selectedLn),
          query,
        },
        undefined,
        { locale: selectedLn },
      );
      Event("CHANGE_LANGUAGE", selectedLn, "Dispo View");
      props.toggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLn]);

  const disabledOptions = languages
    .map((ln) => ln.i18nCode)
    .filter((ln) => !(dispositif?.availableLanguages || []).includes(ln));
  return (
    <MobileModal title={t("Dispositif.readIn")} show={props.show} toggle={props.toggle}>
      <LangueSelectList selectedLn={selectedLn} setSelectedLn={setSelectedLn} disabledOptions={disabledOptions} />
    </MobileModal>
  );
};

export default ReadLanguageModal;
