import demarcheIcon from "@/assets/recherche/illu-demarche.svg";
import FavoriteButton from "@/components/UI/FavoriteButton";
import ThemeBadge from "@/components/UI/ThemeBadge";
import { useUtmz } from "@/hooks";
import { cls } from "@/lib/classname";
import { getReadableText } from "@/lib/getReadableText";
import { getTheme, getThemes } from "@/lib/getTheme";
import commonStyles from "@/scss/components/contentCard.module.scss";
import { themesSelector } from "@/services/Themes/themes.selectors";
import { GetDispositifsResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import styled from "styled-components";
import styles from "./DemarcheCard.module.scss";

const THREE_MONTHS_MS = 3 * 2629746000;

type DemarcheLinkProps = {
  $background: string; // use $ to prevent attribute to be passed to HTML
  $border: string;
};
const DemarcheLink = styled(Link)<DemarcheLinkProps>`
  &:hover,
  .${commonStyles.favorite}:hover + & {
    background-color: ${(props) => props.$background} !important;
    border-color: ${(props) => props.$border} !important;
    color: ${(props) => props.$border} !important;
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

  // updated in the last 3 months
  const hasUpdate = useMemo(() => {
    const today = new Date();
    const lastModificationDate = props.demarche.lastModificationDate
      ? new Date(props.demarche.lastModificationDate)
      : null;

    return lastModificationDate && today.getTime() - lastModificationDate.getTime() < THREE_MONTHS_MS;
  }, [props.demarche.lastModificationDate]);

  return (
    <div className={commonStyles.wrapper}>
      <FavoriteButton contentId={props.demarche._id} className={commonStyles.favorite} />
      <DemarcheLink
        href={{
          pathname: getPath("/demarche/[id]", router.locale),
          query: { id: props.demarche._id.toString(), ...utmParams },
        }}
        passHref
        prefetch={false}
        className={cls(commonStyles.card, commonStyles.demarche, commonStyles.content)}
        $background={colors.color30}
        $border={colors.color100}
        target={props.targetBlank ? "_blank" : undefined}
        rel={props.targetBlank ? "noopener noreferrer" : undefined}
        title={getReadableText(props.demarche.titreInformatif || "")}
      >
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
