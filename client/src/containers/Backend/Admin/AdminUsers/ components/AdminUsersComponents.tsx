import styled from "styled-components";
import React from "react";

interface RoleProps {
  role: string;
}

const RoleContainer = styled.div`
  background: #cdcdcd;
  border-radius: 6px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  padding: 8px;
  width: fit-content;
  margin-right: 4px;
  margin-bottom: 4px;
`;
export const Role = (props: RoleProps) => (
  <RoleContainer>{props.role}</RoleContainer>
);

interface LangueProps {
  langue: string;
}

const LangueContainer = styled.div`
  padding: 8px;
  background: #cdcdcd;
  width: fit-content;
  height: fit-content;
  border-radius: 8px;
  margin-right: 4px;
  margin-bottom: 4px;
`;
export const LangueFlag = (props: LangueProps) => (
  <LangueContainer>
    <i
      className={"flag-icon flag-icon-" + props.langue}
      title={props.langue}
      id={props.langue}
      key={props.langue}
    />
  </LangueContainer>
);
