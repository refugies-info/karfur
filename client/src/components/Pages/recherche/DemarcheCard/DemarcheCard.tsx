import React, {memo} from "react";
import styled from "styled-components";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import { IDispositif } from "types/interface";
import Image from "next/image";
import ThemeBadge from "components/UI/ThemeBadge";
import Link from "next/link";
import { getPath } from "routes";
import { useRouter } from "next/router";
import styles from "./DemarcheCard.module.scss";
import commonStyles from "scss/components/contentCard.module.scss";
import { cls } from "lib/classname";

type DemarcheLinkProps = {
  background: string;
  border: string;
};
const DemarcheLink = styled.a`
  :hover {
    background-color: ${(props: DemarcheLinkProps) => props.background} !important;
    border-color: ${(props: DemarcheLinkProps) => props.border} !important;
    color: ${(props: DemarcheLinkProps) => props.border} !important;
  }
`;

interface Props {
  demarche: IDispositif;
}

const DemarcheCard = (props: Props) => {
  const router = useRouter();
  const colors = props.demarche.theme.colors;
  const themes = [props.demarche.theme, ...(props.demarche.secondaryThemes || [])];
  const hasUpdate = props.demarche.lastModificationDate && props.demarche.publishedAt &&
    new Date(props.demarche.lastModificationDate).toDateString() !== new Date(props.demarche.publishedAt).toDateString();

  return (
    <Link
      href={{
        pathname: getPath("/demarche/[id]", router.locale),
        query: { id: props.demarche._id.toString() }
      }}
      passHref
    >
      <DemarcheLink
        className={cls(commonStyles.card, commonStyles.demarche, commonStyles.content)}
        background={colors.color30}
        border={colors.color100}
      >
        {hasUpdate &&
          <div className={styles.update}>
            <span>mise à jour</span>
          </div>
        }
        <Image src={demarcheIcon} width={48} height={48} alt="" />
        <div
          className={styles.title}
          style={{ color: colors.color100 }}
          dangerouslySetInnerHTML={{__html: props.demarche.titreInformatif}}
        />
        {themes.map((theme, i) => (
          <ThemeBadge key={i} theme={theme} className={styles.badges} />
        ))}
      </DemarcheLink>
    </Link>
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
