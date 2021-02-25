export const checkIfUserIsAdmin = (requestUserRoles: { nom: string }[]) => {
  // user is admin for the platform
  const isAdmin = (requestUserRoles || []).some((x) => x.nom === "Admin");

  if (!isAdmin) throw new Error("NOT_AUTHORIZED");

  return;
};

export const checkRequestIsFromSite = (fromSite: boolean) => {
  if (!fromSite) throw new Error("NOT_FROM_SITE");

  return;
};
