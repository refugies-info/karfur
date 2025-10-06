import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
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
import { useWindowSize } from "@refugies-info/ui";

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
        <div className="">
          <Link href={getPath("/", "fr")} className="" title={t("homepage")}>
            <i className="ri-home-4-line text-mention-grey !bg-transparent !bg-none text-xs [&::before]:![--icon-size:1.25rem]" />
          </Link>

          {chevron}

          <Link
            href={getPath("/recherche", "fr", `?${buildUrlQuery({ type: dispositif.typeContenu })}`)}
            className="text-mention-grey !bg-transparent !bg-none underline decoration-current underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
          >
            {dispositif.typeContenu === ContentType.DISPOSITIF ? t("Dispositif.dispositif") : t("Dispositif.demarche")}
          </Link>

          {chevron}

          {theme && (
            <>
              <Link
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
                className="text-mention-grey !bg-transparent !bg-none underline decoration-solid decoration-auto underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
              >
                {theme.short[locale] || theme.short.fr}
              </Link>
              {chevron}
            </>
          )}

          {dispositif.needs.length === 1 && need && (
            <>
              <Link
                href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
                className="text-mention-grey !bg-transparent !bg-none underline decoration-solid decoration-auto underline-offset-[0.125rem] [text-decoration-skip-ink:auto]"
              >
                {need[locale]?.text || need.fr.text}
              </Link>
              {chevron}
            </>
          )}

          {dispositif.typeContenu === ContentType.DISPOSITIF && (
            <span className="text-active-grey">
              {`${dispositif.titreMarque || ""} ${getDepartments(dispositif.metadatas.location, t)}`}
            </span>
          )}
          {dispositif.typeContenu === ContentType.DEMARCHE && (
            <span className="text-active-grey">{dispositif.titreInformatif}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BreadcrumbDetails;
