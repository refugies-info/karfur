import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { jsUcfirst, jsLcfirst } from "lib";
import { cls } from "lib/classname";
import { getCommitmentText, getPriceText } from "lib/dispositif";
import { getTheme, getThemes } from "lib/getTheme";
import { themesSelector } from "services/Themes/themes.selectors";
import ThemeBadge from "components/UI/ThemeBadge";
import FavoriteButton from "components/UI/FavoriteButton";
import iconMap from "assets/recherche/icon-map.svg";
import iconTime from "assets/recherche/icon-time.svg";
import iconEuro from "assets/recherche/icon-euro.svg";
import defaultStructureImage from "assets/recherche/default-structure-image.svg";
import commonStyles from "scss/components/contentCard.module.scss";
import styles from "./DispositifCard.module.scss";
import { GetDispositifsResponse } from "api-types";

type DispositifLinkProps = {
  background: string;
  border: string;
  demoCard: boolean;
};
const DispositifLink = styled.a<DispositifLinkProps>`
  ${(props) =>
    !props.demoCard &&
    `
:hover {
  background-color: ${props.background} !important;
  border-color: ${props.border} !important;
  color: ${props.border} !important;
}
`}
`;

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
  const colors = theme.colors;
  const dispositifThemes = [theme, ...getThemes(props.dispositif.secondaryThemes || [], themes)];

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
    <Link
      legacyBehavior
      href={
        props.demoCard
          ? "#"
          : {
              pathname: getPath("/dispositif/[id]", router.locale),
              query: { id: props.dispositif._id.toString() },
            }
      }
      passHref
      prefetch={false}
    >
      <DispositifLink
        className={cls(
          commonStyles.card,
          commonStyles.dispositif,
          commonStyles.content,
          styles.card,
          props.demoCard && commonStyles.demo,
          props.demoCard && styles.demo,
        )}
        background={colors.color30}
        border={colors.color100}
        demoCard={!!props.demoCard}
        target={props.targetBlank ? "_blank" : undefined}
        rel={props.targetBlank ? "noopener noreferrer" : undefined}
      >
        <FavoriteButton contentId={props.dispositif._id} className={commonStyles.favorite} />
        <div className={styles.location}>
          <Image src={iconMap} width={16} height={16} alt="" />
          <span style={{ color: colors.color100 }} className="ms-1">
            {getDepartement()}
          </span>
        </div>

        <h3
          className={styles.title}
          style={{ color: colors.color100 }}
          dangerouslySetInnerHTML={{ __html: props.dispositif.titreInformatif || "" }}
        />

        <div
          className={cls(styles.text, styles.max_lines, styles.abstract, props.demoCard && styles.placeholder)}
          style={{ color: colors.color100 }}
          dangerouslySetInnerHTML={{ __html: props.dispositif.abstract || "" }}
        />

        <div className={cls(styles.infos, styles.text, "my-3")} style={{ color: colors.color100 }}>
          {price !== undefined && (
            <div className={cls(styles.info)}>
              <Image src={iconEuro} width={16} height={16} alt="" />
              <div className="ms-2">{getPriceText(price, t)}</div>
            </div>
          )}

          {commitment && (
            <div className={cls(styles.info, "mt-1")}>
              <Image src={iconTime} width={16} height={16} alt="" />
              <div className={cls(styles.ellipsis, "ms-2")}>{getCommitmentText(commitment, t)}</div>
            </div>
          )}
        </div>

        <div className={styles.themes}>
          {dispositifThemes.map((theme, i) => (
            <ThemeBadge key={i} theme={theme} className={styles.badges} />
          ))}
        </div>

        <div className={styles.sponsor} style={{ borderColor: colors.color100 }}>
          <span className={styles.picture}>
            <Image
              src={props.dispositif?.mainSponsor?.picture?.secure_url || defaultStructureImage}
              alt={props.dispositif?.mainSponsor?.nom || ""}
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </span>
          <span
            className={cls(styles.text, styles.max_lines, "ms-2")}
            style={{ color: colors.color100 }}
            dangerouslySetInnerHTML={{ __html: props.dispositif?.titreMarque || "" }}
          />
        </div>
      </DispositifLink>
    </Link>
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
