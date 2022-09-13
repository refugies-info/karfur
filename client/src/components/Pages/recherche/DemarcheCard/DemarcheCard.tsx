import React from "react";
import styled from "styled-components";
import styles from "./DemarcheCard.module.scss";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import { IDispositif } from "types/interface";
import Image from "next/image";
import ThemeBadge from "components/UI/ThemeBadge";
import Link from "next/link";
import { getPath } from "routes";
import { useRouter } from "next/router";

type DemarcheLinkProps = {
  background: string;
  border: string;
};
const DemarcheLink = styled.a`
  :hover {
    background-color: ${(props: DemarcheLinkProps) => props.background};
    border-color: ${(props: DemarcheLinkProps) => props.border};
    color: ${(props: DemarcheLinkProps) => props.border};
  }
`;

interface Props {
  demarche: IDispositif;
}

const DemarcheCard = (props: Props) => {
  const router = useRouter();
  const colors = props.demarche.theme.colors;
  const themes = [props.demarche.theme, ...(props.demarche.secondaryThemes || [])];

  return (
    <Link
      href={{
        pathname: getPath("/demarche/[id]", router.locale),
        query: { id: props.demarche._id.toString() }
      }}
      passHref
    >
      <DemarcheLink className={styles.container} background={colors.color30} border={colors.color100}>
        <Image src={demarcheIcon} width={48} height={48} alt="" />
        <div className={styles.title} style={{ color: colors.color100 }}>
          {props.demarche.titreInformatif}
        </div>

        {themes.map((theme, i) => (
          <ThemeBadge key={i} theme={theme} className={styles.badges} />
        ))}
      </DemarcheLink>
    </Link>
  );
};

export default DemarcheCard;
