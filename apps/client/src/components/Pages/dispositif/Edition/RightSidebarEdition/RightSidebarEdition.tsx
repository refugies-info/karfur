import { useContext, useEffect, useState } from "react";
import { useContentType } from "~/hooks/dispositif";
import { cn } from "~/lib/classname";
import PageContext from "~/utils/pageContext";
import HelpCard from "../HelpCard";
import type { Help } from "./data";
import { getHelp } from "./functions";

/**
 * Right sidebar of the EDIT mode. Used to show the contextual help.
 */
const RightSidebarEdition = ({ className }: { className?: string }) => {
  const pageContext = useContext(PageContext);
  const [help, setHelp] = useState<Help | null>(null);
  const contentType = useContentType();

  useEffect(() => {
    if (!pageContext.activeSection) setHelp(null);
    setHelp(getHelp(pageContext.activeSection, contentType));
  }, [pageContext.activeSection, contentType]);

  return (
    <div className={cn(className)}>
      {help && (
        <HelpCard title={help.title}>
          {Array.isArray(help.text) ? (
            help.text.map((text, i) => <p key={i}>{text}</p>)
          ) : (
            <p>{help.text}</p>
          )}
        </HelpCard>
      )}
    </div>
  );
};

export default RightSidebarEdition;
