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

export const checkRequestIsFromPostman = (fromPostman: boolean) => {
  if (!fromPostman) throw new Error("NOT_AUTHORIZED");

  return;
};

export const checkCronAuthorization = (cronToken: string) => {
  if (!cronToken || process.env.CRON_TOKEN !== cronToken) {
    throw new Error("NOT_AUTHORIZED");
  }
  return;
};
