import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { Metadatas, ShareButtons } from "~/components/Pages/dispositif";
import FRLink from "~/components/UI/FRLink";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";

const LeftSidebar = ({ className }: { className?: string }) => {
  const pageContext = useContext(PageContext);
  const { t } = useTranslation();

  const dispositif = useSelector(selectedDispositifSelector);

  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);

  return (
    <aside className={cn(className)}>
      {isViewMode && (
        <FRLink href="#top" icon="arrow-upward" className="fixed bottom-4 left-4 z-20">
          {t("topLink")}
        </FRLink>
      )}
      <ShareButtons />

      <Metadatas className="flex flex-col gap-4" />
    </aside>
  );
};

export default LeftSidebar;
