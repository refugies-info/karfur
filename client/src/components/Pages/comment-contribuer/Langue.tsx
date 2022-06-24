import React from "react";
import { Progress } from "reactstrap";
import styled from "styled-components";
import Link from "next/link";
import { colorAvancement } from "lib/colors";
import { Language } from "types/interface";

const LangueContainer = styled.a`
  background: #fbfbfb;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  padding: 24px;
  margin-right: 32px;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  align-items: center;
  width: 340px;
  border: 2px solid #fbfbfb;

  &:hover {
    border: 2px solid #212121;
  }
`;
const ProgressContainer = styled.div`
  width: 100px;
  margin-left: ${(props: { isRTL: boolean }) => (props.isRTL ? "8px" : "24px")};
  margin-right: ${(props: { isRTL: boolean }) =>
    props.isRTL ? "24px" : "8px"};
`;
const AvancementContainer = styled.div`
  color: ${(props: { color?: string }) => props.color};
`;

interface Props {
  isRTL: boolean;
  langue: Language;
  key: string;
  href: {
    pathname: string;
    query?: {};
  };
}

const Langue = (props: Props) => (
  <Link href={props.href} passHref>
    <LangueContainer>
      <div
        style={{
          marginRight: props.isRTL ? 0 : 16,
          marginLeft: props.isRTL ? 16 : 0,
        }}
      >
        <i
          title={props.langue.langueCode}
          className={"flag-icon flag-icon-" + props.langue.langueCode}
        />
      </div>
      {props.langue.langueFr === "Persan"
        ? "Persan/Dari"
        : props.langue.langueFr}
      <ProgressContainer isRTL={props.isRTL}>
        <Progress
          color={colorAvancement(props.langue.avancementTrad || 0)}
          value={(props.langue.avancementTrad || 0) * 100}
        />
      </ProgressContainer>
      <AvancementContainer
        className={"text-" + colorAvancement(props.langue.avancementTrad || 0)}
      >
        {Math.round((props.langue.avancementTrad || 0) * 100)}%
      </AvancementContainer>
    </LangueContainer>
  </Link>
);

export default Langue;
