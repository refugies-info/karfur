import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const AlreadyAccountContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  margin-top: 16px;
`;

const PseudoFooter = () => {
  const { t } = useTranslation();

  return (
    <AlreadyAccountContainer>
      {t("Register.Déjà un compte ?", "Déjà un compte ?")}
      <Link href="/login">
        <a
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            marginLeft: "5px",
          }}
        >
          {t("Register.Se connecter", "Se connecter")}
        </a>
      </Link>
    </AlreadyAccountContainer>
  );
};

export default PseudoFooter;
