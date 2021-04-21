export const isUserAllowedToModify = (
  isAdmin: boolean,
  userIsSponsor: boolean,
  isAuthor: boolean,
  status: string | null
) => {
  if (!status) return false;
  if (isAdmin) return true;

  const authorCanModifyStatusList = [
    "Brouillon",
    "En attente",
    "Rejeté structure",
    "En attente non prioritaire",
  ];

  if (authorCanModifyStatusList.includes(status) && isAuthor) return true;
  if (authorCanModifyStatusList.includes(status)) return false;
  if (userIsSponsor) return true;

  return false;
};
