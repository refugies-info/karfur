import { ContentType, GetDispositifResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import { useContentLocale, useLocale, useWindowSize } from "~/hooks";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { needSelector } from "~/services/Needs/needs.selectors";
import { themeSelector } from "~/services/Themes/themes.selectors";
import { getDepartments } from "./functions";

interface Props {
  dispositif: GetDispositifResponse | null;
}

const Breadcrumb = ({ dispositif }: Props) => {
  const { t } = useTranslation();
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const { isTablet } = useWindowSize();

  const theme = useSelector(themeSelector(dispositif?.theme));
  const need = useSelector(needSelector(dispositif?.needs?.[0] || null));
  const { isRTL } = useContentLocale();
  const locale = useLocale();

  const chevron = useMemo(
    () => <i className={`${isRTL ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"} text-mention-grey`} />,
    [isRTL],
  );

  if (!dispositif) return null;
  return (
    <div className="w-full bg-white/80 py-3" style={{ backgroundColor: theme?.colors.color30 || "" }}>
      <div className="fr-container">
        {isTablet && !showBreadcrumb && (
          <button className="" onClick={() => setShowBreadcrumb(true)}>
            {t("showBreadcrumb")}
          </button>
        )}
        {(!isTablet || showBreadcrumb) && (
          <div className="">
            <Link href={getPath("/", "fr")} className="" title={t("homepage")}>
              <i className="ri-home-4-line text-mention-grey" />
            </Link>

            {chevron}

            <Link
              href={getPath("/recherche", "fr", `?${buildUrlQuery({ type: dispositif.typeContenu })}`)}
              className="underline decoration-solid decoration-auto underline-offset-auto"
              style={{ textDecorationSkipInk: "none", textUnderlinePosition: "auto" }}
            >
              {dispositif.typeContenu === ContentType.DISPOSITIF ? t("actions") : t("demarches")}
            </Link>

            {chevron}

            {theme && (
              <>
                <Link
                  href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
                  className="underline decoration-solid decoration-auto underline-offset-auto"
                  style={{ textDecorationSkipInk: "none", textUnderlinePosition: "auto" }}
                >
                  {theme.short.fr}
                </Link>
                {chevron}
              </>
            )}

            {dispositif.needs.length === 1 && need && (
              <>
                <Link
                  href={getPath("/recherche", "fr", `?${buildUrlQuery({ needs: [need._id] })}`)}
                  className="underline decoration-solid decoration-auto underline-offset-auto"
                  style={{ textDecorationSkipInk: "none", textUnderlinePosition: "auto" }}
                >
                  {need[locale]?.text || need.fr.text}
                </Link>
                {chevron}
              </>
            )}

            {dispositif.typeContenu === ContentType.DISPOSITIF && (
              <span className="">
                {`${dispositif.titreMarque || ""} ${getDepartments(dispositif.metadatas.location, t)}`}
              </span>
            )}
            {dispositif.typeContenu === ContentType.DEMARCHE && <span className="">{dispositif.titreInformatif}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
