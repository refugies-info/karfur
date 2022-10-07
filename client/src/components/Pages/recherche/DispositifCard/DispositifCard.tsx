import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { SearchDispositif } from "types/interface";
import { getPath } from "routes";
import { cls } from "lib/classname";
import { getTheme, getThemes } from "lib/getTheme";
import { getDispositifInfos } from "lib/getDispositifInfos";
import { themesSelector } from "services/Themes/themes.selectors";
import ThemeBadge from "components/UI/ThemeBadge";
import iconMap from "assets/recherche/icon-map.svg";
import iconTime from "assets/recherche/icon-time.svg";
import iconEuro from "assets/recherche/icon-euro.svg";
import defaultStructureImage from "assets/recherche/default-structure-image.svg";
import commonStyles from "scss/components/contentCard.module.scss";
import styles from "./DispositifCard.module.scss";

type DispositifLinkProps = {
  background: string;
  border: string;
};
const DispositifLink = styled.a`
  :hover {
    background-color: ${(props: DispositifLinkProps) => props.background} !important;
    border-color: ${(props: DispositifLinkProps) => props.border} !important;
    color: ${(props: DispositifLinkProps) => props.border} !important;
  }
`;

interface Props {
  dispositif: SearchDispositif;
  selectedDepartment?: string;
}

const DispositifCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.dispositif.theme, themes);
  const colors = theme.colors;
  const dispositifThemes = [theme, ...getThemes(props.dispositif.secondaryThemes || [], themes)];

  const location = getDispositifInfos(props.dispositif, "location");
  const duration = getDispositifInfos(props.dispositif, "duration");
  const price = getDispositifInfos(props.dispositif, "price");

  const getDepartement = () => {
    if (!location || !location.departments) return null;
    if (props.selectedDepartment) return props.selectedDepartment;
    if (location.departments.length > 1) return `${location.departments.length} ${t("Dispositif.Départements", "Départements")}`;
    if (location.departments.length === 1 && location.departments[0] === "All") return t("Recherche.france", "toute la France");
    return location.departments[0];
  };

  return (
    <Link
      href={{
        pathname: getPath("/dispositif/[id]", router.locale),
        query: { id: props.dispositif._id.toString() }
      }}
      passHref
    >
      <DispositifLink
        className={cls(commonStyles.card, commonStyles.dispositif, commonStyles.content)}
        background={colors.color30}
        border={colors.color100}
      >
        <div className={styles.location}>
          <Image src={iconMap} width={16} height={16} alt="" />
          <span style={{ color: colors.color100 }} className="ml-2">
            {getDepartement()}
          </span>
        </div>

        <div
          className={styles.title}
          style={{ color: colors.color100 }}
          dangerouslySetInnerHTML={{ __html: props.dispositif.titreInformatif }}
        />

        <div
          className={cls(styles.text, styles.abstract)}
          style={{ color: colors.color100 }}
          dangerouslySetInnerHTML={{ __html: props.dispositif.abstract }}
        />

        <div className={cls(styles.infos, styles.text, "my-4")} style={{ color: colors.color100 }}>
          {price?.price !== undefined && (
            <div className="d-flex">
              <Image src={iconEuro} width={16} height={16} alt="" />
              {price?.price === 0 ? (
                <div className="ml-2">{t("Dispositif.Gratuit", "Gratuit")}</div>
              ) : (
                <div className="ml-2">
                  {price?.price}€ {price?.contentTitle}
                </div>
              )}
            </div>
          )}

          {duration?.contentTitle && (
            <div className="d-flex mt-1">
              <Image src={iconTime} width={16} height={16} alt="" />
              <div className="ml-2" dangerouslySetInnerHTML={{ __html: duration?.contentTitle || "" }}></div>
            </div>
          )}
        </div>

        <div className={styles.themes}>
          {dispositifThemes.map((theme, i) => (
            <ThemeBadge key={i} theme={theme} className={styles.badges} />
          ))}
        </div>

        <div className={styles.sponsor} style={{ borderColor: colors.color80 }}>
          <span className={styles.picture}>
            <Image
              src={props.dispositif?.mainSponsor?.picture?.secure_url || defaultStructureImage}
              alt={props.dispositif?.mainSponsor.nom}
              width={40}
              height={40}
              objectFit="contain"
            />
          </span>
          <span
            className={cls(styles.text, "ml-2")}
            style={{ color: colors.color100 }}
            dangerouslySetInnerHTML={{ __html: props.dispositif?.titreMarque }}
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
