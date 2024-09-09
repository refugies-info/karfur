import Badge from "@codegouvfr/react-dsfr/Badge";
import Card from "@codegouvfr/react-dsfr/Card";
import { ContentType, GetDispositifsResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";
import defaultStructureImage from "~/assets/recherche/default-structure-image.svg";
import FavoriteButton from "~/components/UI/FavoriteButton";
import { useSanitizedContent, useUtmz } from "~/hooks";
import { useCardImageUrl } from "~/hooks/useCardImage";
import { jsLcfirst, jsUcfirst } from "~/lib";
import { cls } from "~/lib/classname";
import { getCommitmentText, getPriceText } from "~/lib/dispositif";
import { getReadableText } from "~/lib/getReadableText";
import { getTheme } from "~/lib/getTheme";
import { getPath } from "~/routes";
import styles from "~/scss/components/contentCard.module.scss";
import { themesSelector } from "~/services/Themes/themes.selectors";
import { NewThemeBadge } from "../NewThemeBadge";

interface Props {
  dispositif: GetDispositifsResponse;
  selectedDepartment?: string;
  targetBlank?: boolean;
  demoCard?: boolean;
}

const DispositifCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.dispositif.theme, themes);
  const { params: utmParams } = useUtmz();

  const commitment = props.dispositif.metadatas?.commitment;
  const price = props.dispositif.metadatas?.price;
  const isOnline = props.dispositif.metadatas?.location === "online";

  const getDepartement = () => {
    const location = props.dispositif.metadatas?.location;
    if (!location) return null;
    if (!Array.isArray(location)) {
      if (location === "france") return jsUcfirst(t("Recherche.france", "toute la France"));
      if (location === "online") return jsUcfirst(t("Recherche.online"));
    }
    if (props.selectedDepartment) return props.selectedDepartment;
    if (Array.isArray(location) && location.length > 1)
      return `${location.length} ${jsLcfirst(t("Dispositif.Départements", "Départements"))}`;

    const splittedLocation = location[0].split(" - ");
    return `${splittedLocation[1]} ${splittedLocation[0]}`;
  };

  const safeSponsorName = useSanitizedContent(props.dispositif?.sponsor?.nom);
  const safeTitreMarque = useSanitizedContent(props.dispositif?.titreMarque);
  const safeTitreInformatif = useSanitizedContent(props.dispositif.titreInformatif);
  const safeAbstract = useSanitizedContent(props.dispositif.abstract);
  const cardImageUrl = useCardImageUrl(theme, ContentType.DISPOSITIF);

  return (
    <div className={cls(styles.wrapper)}>
      <Card
        background
        border
        enlargeLink
        linkProps={{
          href: props.demoCard
            ? "#"
            : {
                pathname: getPath("/dispositif/[id]", router.locale),
                query: { id: props.dispositif._id.toString(), ...utmParams },
              },
          target: props.targetBlank ? "_blank" : undefined,
          rel: props.targetBlank ? "noopener noreferrer" : undefined,
          title: getReadableText(props.dispositif.titreInformatif || ""),
          className: "fr-link",
        }}
        size="medium"
        imageAlt=""
        imageUrl={cardImageUrl}
        badge={
          <Badge small className={isOnline ? styles.badge_online : styles.badge_department}>
            {isOnline && <i className="ri-at-line me-1"></i>}
            {getDepartement()}
          </Badge>
        }
        start={
          <>
            <div className={styles.sponsor}>
              <Image
                src={props.dispositif?.sponsor?.picture?.secure_url || defaultStructureImage}
                alt={props.dispositif?.sponsor?.nom || ""}
                width={48}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="d-flex gap-2 mb-2">
              <NewThemeBadge theme={theme} />
              {(props.dispositif.secondaryThemes?.length || 0) > 0 && (
                <NewThemeBadge theme={props.dispositif.secondaryThemes?.length || 0} />
              )}
            </div>
            <div className={cls(styles.info, "mb-3")}>
              <i className="fr-icon-building-line" />
              <span dangerouslySetInnerHTML={{ __html: safeSponsorName }} />
            </div>
          </>
        }
        title={<span className={styles.three_lines} dangerouslySetInnerHTML={{ __html: safeTitreInformatif }}></span>}
        titleAs="h3"
        desc={<span className={styles.three_lines} dangerouslySetInnerHTML={{ __html: safeAbstract }}></span>}
        end={
          <div className="d-flex gap-3">
            {price !== undefined && (
              <div className={styles.info}>
                <i className="fr-icon-money-euro-circle-line" />
                <span>{getPriceText(price, t)}</span>
              </div>
            )}

            {commitment && (
              <div className={styles.info}>
                <i className="fr-icon-time-line" />
                <span>{getCommitmentText(commitment, t)}</span>
              </div>
            )}
          </div>
        }
      />

      <FavoriteButton contentId={props.dispositif._id} className={styles.favorite} />
    </div>
  );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prevDisp = prevProps.dispositif;
  const nextDisp = nextProps.dispositif;

  const sameDisp = prevDisp._id === nextDisp._id;
  const sameText =
    prevDisp.titreInformatif === nextDisp.titreInformatif ||
    prevDisp.abstract === nextDisp.abstract ||
    (prevDisp?.titreMarque ? prevDisp.titreMarque === nextDisp?.titreMarque : true);
  const sameDep = prevProps.selectedDepartment && prevProps.selectedDepartment === nextProps.selectedDepartment;

  return !!sameDisp && !!sameText && !!sameDep;
};

export default memo(DispositifCard, propsAreEqual);
