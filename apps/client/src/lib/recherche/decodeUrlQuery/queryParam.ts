/**
 * Next.js decodes query string values before handing them to getServerSideProps
 * and router.query, so they must NOT be decoded a second time: a literal "%" in
 * a search term ("100%") would throw `URIError: URI malformed` and crash the
 * page with a 500.
 */
export const asString = (value: string | string[] | undefined | null): string =>
  Array.isArray(value) ? value.join(",") : (value ?? "");
