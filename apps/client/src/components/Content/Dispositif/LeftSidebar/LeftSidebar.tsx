import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import { Metadatas, ShareButtons } from "~/components/Pages/dispositif";
import FRLink from "~/components/UI/FRLink";
import { cn } from "~/lib/classname";
import PageContext from "~/utils/pageContext";

const LeftSidebar = ({ className }: { className?: string }) => {
  const pageContext = useContext(PageContext);
  const { t } = useTranslation();

  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);

  return (
    <aside className={cn(className, "print:order-2 print:mt-8")}>
      {isViewMode && (
        <FRLink
          href="#top"
          icon="arrow-upward"
          className="fixed bottom-4 left-4 z-20 print:!hidden"
        >
          {t("topLink")}
        </FRLink>
      )}
      <ShareButtons className="print:hidden" />

      <Metadatas className="flex flex-col gap-4" />
    </aside>
  );
};

export default LeftSidebar;
