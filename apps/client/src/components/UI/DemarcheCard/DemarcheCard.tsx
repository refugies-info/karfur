import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import { ContentType, GetDispositifsResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";
import demarcheIcon from "~/assets/recherche/illu-demarche.svg";
import FavoriteButton from "~/components/UI/FavoriteButton";
import { useSanitizedContent, useUtmz } from "~/hooks";
import { useCardImageUrl } from "~/hooks/useCardImage";
import { cls } from "~/lib/classname";
import { getReadableText } from "~/lib/getReadableText";
import { getRelativeTimeString } from "~/lib/getRelativeDate";
import { getTheme } from "~/lib/getTheme";
import { getPath } from "~/routes";
import styles from "~/scss/components/contentCard.module.scss";
import { themesSelector } from "~/services/Themes/themes.selectors";
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

  const safeTitreMarque = useSanitizedContent(props.demarche?.titreMarque);
  const safeTitreInformatif = useSanitizedContent(props.demarche.titreInformatif);
  const safeAbstract = useSanitizedContent(props.demarche.abstract);
  const cardImageUrl = useCardImageUrl(theme, ContentType.DISPOSITIF);

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
          className: "fr-link",
        }}
        size="medium"
        imageAlt="texte alternatif de l’image"
        imageUrl={cardImageUrl}
        badge={
          <Badge small className={styles.badge_demarche}>
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
            {/* TODO: update code below when operator capability is added to the demarche */}
            {props.demarche?.titreMarque && (
              <div className={cls(styles.info, "mb-3")}>
                <i className="fr-icon-building-line" />
                <span dangerouslySetInnerHTML={{ __html: safeTitreMarque }} />
              </div>
            )}
          </>
        }
        title={<span dangerouslySetInnerHTML={{ __html: safeTitreInformatif }}></span>}
        titleAs="h3"
        desc={<span dangerouslySetInnerHTML={{ __html: safeAbstract }}></span>}
        end={
          props.demarche.lastModificationDate ? (
            <div className={styles.info}>
              <i className="fr-icon-time-line" />
              Mise à jour {getRelativeTimeString(new Date(props.demarche.lastModificationDate), router.locale || "fr")}
            </div>
          ) : null
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
