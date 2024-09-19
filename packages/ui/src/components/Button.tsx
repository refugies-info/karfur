import { Button as DSFRButton } from "@codegouvfr/react-dsfr/Button";
import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <DSFRButton onClick={onClick}>{children}</DSFRButton>;
};
