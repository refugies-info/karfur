import { ContentType, DispositifStatus, GetDispositifResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getPath } from "routes";
import Button from "~/components/UI/Button";
import { useContentLocale, useLocale, useWindowSize } from "~/hooks";
import { canEdit, isStatus } from "~/lib/dispositif";
import { buildUrlQuery } from "~/lib/recherche/buildUrlQuery";
import { needSelector } from "~/services/Needs/needs.selectors";
import { themeSelector } from "~/services/Themes/themes.selectors";
import { userSelector } from "~/services/User/user.selectors";
import PageContext from "~/utils/pageContext";
import Status from "../Status";
import EditModal from "./EditModal";
import { getDepartments } from "./functions";

interface Props {
  dispositif: GetDispositifResponse | null;
}

const Breadcrumb = ({ dispositif }: Props) => {
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const { isTablet } = useWindowSize();

  const theme = useSelector(themeSelector(dispositif?.theme));
  const need = useSelector(needSelector(dispositif?.needs?.[0] || null));
  const { isRTL } = useContentLocale();
  const locale = useLocale();
  const pageContext = useContext(PageContext);

  const chevron = useMemo(
    () => <i className={`${isRTL ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"} text-mention-grey`} />,
    [isRTL],
  );

  // edit
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigateToEdit = useCallback(() => {
    if (!dispositif?._id) return;
    router.push({
      pathname:
        dispositif.typeContenu === ContentType.DEMARCHE
          ? getPath("/demarche/[id]/edit", "fr")
          : getPath("/dispositif/[id]/edit", "fr"),
      query: { id: dispositif._id.toString() },
    });
  }, [dispositif, router]);

  const onEditClick = useCallback(() => {
    if (isStatus(dispositif?.status, DispositifStatus.ACTIVE)) {
      setShowEditModal(true);
    } else {
      navigateToEdit();
    }
  }, [dispositif, navigateToEdit]);

  if (!dispositif) return null;
  return (
    <div className="w-full bg-white/80 py-3" style={{ backgroundColor: theme?.colors.color30 || "" }}>
      <div className="fr-container flex justify-between">
        <div>
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
                {dispositif.typeContenu === ContentType.DISPOSITIF
                  ? t("Dispositif.dispositif")
                  : t("Dispositif.demarche")}
              </Link>

              {chevron}

              {theme && (
                <>
                  <Link
                    href={getPath("/recherche", "fr", `?${buildUrlQuery({ themes: [theme._id] })}`)}
                    className="underline decoration-solid decoration-auto underline-offset-auto"
                    style={{ textDecorationSkipInk: "none", textUnderlinePosition: "auto" }}
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
              {dispositif.typeContenu === ContentType.DEMARCHE && (
                <span className="">{dispositif.titreInformatif}</span>
              )}
            </div>
          )}
        </div>
        <div>
          {canEdit(dispositif, user.user) && pageContext.mode === "view" && (
            <>
              <Status
                status={dispositif?.status}
                hasDraftVersion={!!dispositif?.hasDraftVersion}
                isAdmin={user.admin}
                className="me-4"
              />
              <Button evaIcon="edit-outline" className="" onClick={onEditClick}>
                Modifier la fiche
              </Button>
              <EditModal show={showEditModal} toggle={() => setShowEditModal((o) => !o)} onValidate={navigateToEdit} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
