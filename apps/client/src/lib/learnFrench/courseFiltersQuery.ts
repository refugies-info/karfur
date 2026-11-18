export type CourseQuery = Record<string, string | string[]>;

export const COURSE_FILTER_QUERY_KEYS = [
  "departments",
  "cities",
  "frenchLevel",
  "categories",
  "publicFilter",
  "search",
  "tab",
] as const;

export const mergeCourseFiltersQuery = (
  currentQuery: Record<string, string | string[] | undefined>,
  filtersQuery: CourseQuery,
): CourseQuery => {
  const otherParams = Object.fromEntries(
    Object.entries(currentQuery).filter(
      (entry): entry is [string, string | string[]] =>
        entry[1] !== undefined &&
        !(COURSE_FILTER_QUERY_KEYS as readonly string[]).includes(entry[0]),
    ),
  );
  return { ...otherParams, ...filtersQuery };
};
