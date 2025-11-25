import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import { cn, useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { useContentLocale, useLocale } from "~/hooks";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { needSelector } from "~/services/Needs/needs.selectors";
import { themeSelector } from "~/services/Themes/themes.selectors";
import { getDepartments } from "./functions";

interface Props {
  dispositif: GetDispositifResponse;
}

const BreadcrumbDetails = ({ dispositif }: Props) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowSize();
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const { isRTL } = useContentLocale();
  const locale = useLocale();
  const theme = useSelector(themeSelector(dispositif?.theme));
  const need = useSelector(needSelector(dispositif?.needs?.[0] || null));
  const chevron = useMemo(
    () => (
      <i
        className={cn(
          "text-mention-grey [&::before]:![--icon-size:1rem]",
          isRTL ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line",
        )}
      />
    ),
    [isRTL],
  );

  return (
    <div>
      {isTablet && !showBreadcrumb && (
        <button className="" onClick={() => setShowBreadcrumb(true)}>
          {t("showBreadcrumb")}
        </button>
      )}
      {(!isTablet || showBreadcrumb) && (
        <nav aria-label={t("breadcrumbs", "Fil d'Ariane")}>
          <ol className="!m-0 flex !list-none flex-wrap items-center !p-0 [&>li]:!list-none [&>li]:before:!content-none [&>li::marker]:!content-none">
            <li>
              <Link href={getPath("/", "fr")} className="" title={t("homepage")}>
                <i className="ri-home-4-line text-mention-grey !bg-transparent !bg-none text-xs [&::before]:![--icon-size:1.25rem]" />
                <span className="sr-only">{t("homepage")}</span>
              </Link>
            </li>

            <li aria-hidden="true" className="mx-1 select-none">
              {chevron}
            </li>

            <li>
              <Link
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ type: dispositif.typeContenu })}`)}
                className="text-mention-grey !bg-transparent !bg-none underline decoration-current underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
              >
                {dispositif.typeContenu === ContentType.DISPOSITIF
                  ? t("Dispositif.dispositif")
                  : t("Dispositif.demarche")}
              </Link>
            </li>

            <li aria-hidden="true" className="mx-1 select-none">
              {chevron}
            </li>

            {theme && (
              <>
                <li>
                  <Link
                    href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
                    className="text-mention-grey !bg-transparent !bg-none underline decoration-solid decoration-auto underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
                  >
                    {theme.short[locale] || theme.short.fr}
                  </Link>
                </li>
                <li aria-hidden="true" className="mx-1 select-none">
                  {chevron}
                </li>
              </>
            )}

            {dispositif.needs.length === 1 && need && (
              <>
                <li>
                  <Link
                    href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
                    className="text-mention-grey !bg-transparent !bg-none underline decoration-solid decoration-auto underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
                  >
                    {need[locale]?.text || need.fr.text}
                  </Link>
                </li>
                <li aria-hidden="true" className="mx-1 select-none">
                  {chevron}
                </li>
              </>
            )}

            <li>
              {dispositif.typeContenu === ContentType.DISPOSITIF && (
                <span className="text-active-grey" aria-current="page">
                  {`${dispositif.titreMarque || ""} ${getDepartments(dispositif.metadatas.location, t)}`}
                </span>
              )}
              {dispositif.typeContenu === ContentType.DEMARCHE && (
                <span className="text-active-grey" aria-current="page">
                  {dispositif.titreInformatif}
                </span>
              )}
            </li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default BreadcrumbDetails;
