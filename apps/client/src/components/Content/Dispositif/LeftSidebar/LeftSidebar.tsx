import { ContentType } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { Metadatas, ShareButtons, Summary } from "~/components/Pages/dispositif";
import FRLink from "~/components/UI/FRLink";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "~/services/Themes/themes.selectors";
import PageContext from "~/utils/pageContext";

const LeftSidebar = ({ className }: { className?: string }) => {
  const pageContext = useContext(PageContext);
  const { t } = useTranslation();

  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));

  const color100 = useMemo(() => theme?.colors.color100 || "#000", [theme]);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);

  return (
    <aside className={cn(className)}>
      {isViewMode && (
        <FRLink href="#top" icon="arrow-upward" className="fixed bottom-4 left-4 z-20">
          {t("topLink")}
        </FRLink>
      )}
      <ShareButtons />

      <Summary />
      <Metadatas
        metadatas={dispositif?.metadatas}
        titreMarque={dispositif?.titreMarque}
        mainSponsor={dispositif?.mainSponsor}
        color={color100}
        typeContenu={dispositif?.typeContenu || ContentType.DISPOSITIF}
      />
    </aside>
  );
};

export default LeftSidebar;
