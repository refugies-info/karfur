import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { jsUcfirst, jsLcfirst } from "lib";
import { useUtmz } from "hooks";
import { cls } from "lib/classname";
import { getCommitmentText, getPriceText } from "lib/dispositif";
import { getTheme } from "lib/getTheme";
import { themesSelector } from "services/Themes/themes.selectors";
import FavoriteButton from "components/UI/FavoriteButton";
import defaultStructureImage from "assets/recherche/default-structure-image.svg";
import styles from "scss/components/contentCard.module.scss";
import { GetDispositifsResponse } from "@refugies-info/api-types";
import { getReadableText } from "lib/getReadableText";
import Card from "@codegouvfr/react-dsfr/Card";
import Badge from "@codegouvfr/react-dsfr/Badge";
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
    return location[0];
  };

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
        }}
        size="medium"
        imageAlt="texte alternatif de l’image"
        imageUrl="https://www.systeme-de-design.gouv.fr/img/placeholder.16x9.png"
        badge={
          <Badge>
            <span>{getDepartement()}</span>
          </Badge>
        }
        start={
          <>
            <div className={styles.sponsor}>
              <Image
                src={props.dispositif?.mainSponsor?.picture?.secure_url || defaultStructureImage}
                alt={props.dispositif?.mainSponsor?.nom || ""}
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
              <span dangerouslySetInnerHTML={{ __html: props.dispositif?.titreMarque || "" }} />
            </div>
          </>
        }
        title={<span dangerouslySetInnerHTML={{ __html: props.dispositif.titreInformatif || "" }}></span>}
        titleAs="h3"
        desc={<span dangerouslySetInnerHTML={{ __html: props.dispositif.abstract || "" }}></span>}
        end={
          <div className="d-flex col-gap-3 row-gap-1 flex-wrap">
            {price !== undefined && (
              <div className={styles.info}>
                <i className="fr-icon-money-euro-circle-line" />
                <div className="ms-2">{getPriceText(price, t)}</div>
              </div>
            )}

            {commitment && (
              <div className={styles.info}>
                <i className="fr-icon-time-line" />
                <div className={cls("ms-2")}>{getCommitmentText(commitment, t)}</div>
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
