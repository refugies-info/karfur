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
`;
export const Role = (props: RoleProps) => (
  <RoleContainer>{props.role}</RoleContainer>
);
