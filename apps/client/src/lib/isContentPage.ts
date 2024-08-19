export const isContentPage = (url: string) => ["/demarche/", "/dispositif/", "/procedure/", "/program/"].some((path) =>
  url.includes(path),
);
