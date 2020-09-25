import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireCreate.container";
import { cps } from "redux-saga/effects";

export interface PropsBeforeInjection {
  history: any;
}

export const AnnuaireCreateComponent = (props: Props) => {
  const checkUserIsContribOrRespo = () => {
    const structureMembers = props.structure ? props.structure.membres : [];
    const userInStructure = structureMembers.filter(
      (member) => member.userId === props.userId
    );
    if (userInStructure.length === 0) props.history.push("/");
    const isUserRedacteurOrRespo =
      userInStructure[0].roles.filter(
        (role) => role === "administrateur" || role === "contributeur"
      ).length > 0;
    if (!isUserRedacteurOrRespo) props.history.push("/");
  };

  useEffect(() => {
    if (props.isLoading === false) {
      return checkUserIsContribOrRespo();
    }
  });

  if (props.isLoading) {
    return <div>isLoading</div>;
  }
  return <div>Hello</div>;
};
