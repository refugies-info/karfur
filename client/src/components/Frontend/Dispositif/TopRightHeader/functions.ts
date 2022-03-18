import { IDispositif, User } from "types/interface";

export const isUserSponsor = (user: User | null, selectedDispositif: IDispositif | null) => {
  // there are 3 roles in a structure : admin = responsable, contributeur : can modify dispositifs of the structure, membre : cannot modify
  return user && selectedDispositif
    ? (
      (
        ((selectedDispositif.mainSponsor || {}).membres || [])
          // @ts-ignore
          .find((x) => x.userId === user._id) || {}
      ).roles || []
    ).some((y) => y === "administrateur" || y === "contributeur")
    : false;
};

export const isUserAuthor = (user: User | null, selectedDispositif: IDispositif | null) => {
  return user && selectedDispositif && selectedDispositif.creatorId
    ? user._id === (selectedDispositif.creatorId || {})._id
    : false;
}

export const isUserAllowedToModify = (
  isAdmin: boolean,
  user: User | null,
  selectedDispositif: IDispositif | null,
) => {
  if (!user || !selectedDispositif || !selectedDispositif.status) return false;
  if (isAdmin) return true;

  const authorCanModifyStatusList = [
    "Brouillon",
    "En attente",
    "Rejeté structure",
    "En attente non prioritaire",
  ];

  const isAuthor = isUserAuthor(user, selectedDispositif);
  const isSponsor = isUserSponsor(user, selectedDispositif);
  if (authorCanModifyStatusList.includes(selectedDispositif.status) && isAuthor) return true;
  if (authorCanModifyStatusList.includes(selectedDispositif.status)) return false;
  if (isSponsor) return true;

  return false;
};

