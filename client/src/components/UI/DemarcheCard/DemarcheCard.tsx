import { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { useUtmz } from "hooks";
import { themesSelector } from "services/Themes/themes.selectors";
import { getTheme } from "lib/getTheme";
import { cls } from "lib/classname";
import FavoriteButton from "components/UI/FavoriteButton";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import styles from "scss/components/contentCard.module.scss";
import { GetDispositifsResponse } from "@refugies-info/api-types";
import { getReadableText } from "lib/getReadableText";
import Card from "@codegouvfr/react-dsfr/Card";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { NewThemeBadge } from "../NewThemeBadge";

interface Props {
  demarche: GetDispositifsResponse;
  targetBlank?: boolean;
}

const DemarcheCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.demarche.theme, themes);
  const { params: utmParams } = useUtmz();

  return (
    <div className={styles.wrapper}>
      <Card
        background
        border
        enlargeLink
        linkProps={{
          href: {
            pathname: getPath("/demarche/[id]", router.locale),
            query: { id: props.demarche._id.toString(), ...utmParams },
          },
          target: props.targetBlank ? "_blank" : undefined,
          rel: props.targetBlank ? "noopener noreferrer" : undefined,
          title: getReadableText(props.demarche.titreInformatif || ""),
        }}
        size="medium"
        imageAlt="texte alternatif de l’image"
        imageUrl="https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png"
        badge={
          <Badge>
            <span>Démarche</span>
          </Badge>
        }
        start={
          <>
            <div className={styles.sponsor}>
              <Image src={demarcheIcon} width={48} height={48} alt="" />
            </div>
            <div className="d-flex gap-2 mb-2">
              <NewThemeBadge theme={theme} />
              {(props.demarche.secondaryThemes?.length || 0) > 0 && (
                <NewThemeBadge theme={props.demarche.secondaryThemes?.length || 0} />
              )}
            </div>
            <div className={cls(styles.info, "mb-3")}>
              <i className="fr-icon-building-line" />
              <span dangerouslySetInnerHTML={{ __html: props.demarche?.titreMarque || "" }} />
            </div>
          </>
        }
        title={<span dangerouslySetInnerHTML={{ __html: props.demarche.titreInformatif || "" }}></span>}
        titleAs="h3"
        desc={<span dangerouslySetInnerHTML={{ __html: props.demarche.abstract || "" }}></span>}
        end={
          <div className="d-flex col-gap-3 row-gap-1 flex-wrap">
            <div className={styles.info}>
              <i className="fr-icon-time-line" />
              Mise à jour il y a
            </div>
          </div>
        }
      />

      <FavoriteButton contentId={props.demarche._id} className={styles.favorite} />
    </div>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevDemarche = prevProps.demarche;
  const nextDemarche = nextProps.demarche;

  const sameDisp = prevDemarche._id === nextDemarche._id;
  const sameText = prevDemarche.titreInformatif === nextDemarche.titreInformatif;

  return !!sameDisp && !!sameText;
};

export default memo(DemarcheCard, propsAreEqual);
