import moment from "moment";
import "moment/locale/ar";
import "moment/locale/en-gb";
import "moment/locale/fa";
import "moment/locale/fr";
import "moment/locale/ru";
import "moment/locale/uk";
import { useTranslation } from "next-i18next";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import Badge from "~/components/UI/Badge";
import Button from "~/components/UI/Button";
import { useLocale } from "~/hooks";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import Breadcrumb from "../Breadcrumb";
import { sharingOptions } from "../function";
import SectionButtons from "../SectionButtons";
import Title from "../Title";
import styles from "./Header.module.scss";

interface Props {
  typeContenu: string;
}

const Header = (props: Props) => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const pageContext = useContext(PageContext);
  return (
    <header className={styles.container}>
      {pageContext.mode === "view" && <Breadcrumb dispositif={dispositif} />}
      <div className="position-relative">
        <Title />
        {pageContext.mode === "view" && (
          <>
            {dispositif?.date && (
              <Badge severity="info" small icon="ri-information-fill">{`${t("Dispositif.updated")} ${moment(
                dispositif.date,
              ).fromNow()}`}</Badge>
            )}

            <Button
              className={styles.share}
              priority="tertiary"
              evaIcon="share-outline"
              onClick={() => {
                sharingOptions(props.typeContenu, dispositif?.titreInformatif || "", dispositif?.titreMarque || "");
                Event("Share", "mobile", "from dispositif header");
              }}
            >
              {t("Dispositif.share")}
            </Button>

            <SectionButtons id="titreInformatif" content={dispositif?.titreInformatif || ""} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
