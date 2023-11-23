import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { useUtmz } from "hooks";
import { themesSelector } from "services/Themes/themes.selectors";
import { getTheme, getThemes } from "lib/getTheme";
import { cls } from "lib/classname";
import ThemeBadge from "components/UI/ThemeBadge";
import FavoriteButton from "components/UI/FavoriteButton";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import commonStyles from "scss/components/contentCard.module.scss";
import styles from "./DemarcheCard.module.scss";
import { GetDispositifsResponse } from "@refugies-info/api-types";

const ONE_DAY_MS = 86400000;

type DemarcheLinkProps = {
  background: string;
  border: string;
};
const DemarcheLink = styled(Link)<DemarcheLinkProps>`
  :hover {
    background-color: ${(props) => props.background} !important;
    border-color: ${(props) => props.border} !important;
    color: ${(props) => props.border} !important;
  }
`;

interface Props {
  demarche: GetDispositifsResponse;
  targetBlank?: boolean;
}

const DemarcheCard = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const theme = getTheme(props.demarche.theme, themes);
  const colors = theme.colors;
  const demarcheThemes = [theme, ...getThemes(props.demarche.secondaryThemes || [], themes)];
  const { params: utmParams } = useUtmz();

  const lastModificationDate = props.demarche.lastModificationDate
    ? new Date(props.demarche.lastModificationDate)
    : null;
  const publishedAt = props.demarche.publishedAt ? new Date(props.demarche.publishedAt) : null;

  // more than 1 day between publication and edition
  const hasUpdate =
    lastModificationDate && publishedAt && lastModificationDate.getTime() - publishedAt.getTime() > ONE_DAY_MS;

  return (
    <DemarcheLink
      // legacyBehavior
      href={{
        pathname: getPath("/demarche/[id]", router.locale),
        query: { id: props.demarche._id.toString(), ...utmParams },
      }}
      passHref
      prefetch={false}
      className={cls(commonStyles.card, commonStyles.demarche, commonStyles.content)}
      background={colors.color30}
      border={colors.color100}
      target={props.targetBlank ? "_blank" : undefined}
      rel={props.targetBlank ? "noopener noreferrer" : undefined}
    >
      <FavoriteButton contentId={props.demarche._id} className={commonStyles.favorite} />
      {hasUpdate && (
        <div className={styles.update}>
          <span>{t("Recherche.updated", "mise à jour")}</span>
        </div>
      )}
      <div>
        <Image src={demarcheIcon} width={48} height={48} alt="" />
      </div>
      <h3
        className={styles.title}
        style={{ color: colors.color100 }}
        dangerouslySetInnerHTML={{ __html: props.demarche.titreInformatif || "" }}
      />
      <div className={styles.themes}>
        {demarcheThemes.map((theme, i) => (
          <ThemeBadge key={i} theme={theme} className={styles.badges} />
        ))}
      </div>
    </DemarcheLink>
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
