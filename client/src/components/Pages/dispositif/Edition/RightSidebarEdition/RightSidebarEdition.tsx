import React, { useContext, useEffect, useState } from "react";
import PageContext from "utils/pageContext";
import HelpCard from "../HelpCard";
import { Help } from "./data";
import { getHelp } from "./functions";
import styles from "./RightSidebarEdition.module.scss";

/**
 * Right sidebar of the EDIT mode. Used to show the contextual help.
 */
const RightSidebarEdition = () => {
  const pageContext = useContext(PageContext);
  const [help, setHelp] = useState<Help | null>(null);

  useEffect(() => {
    if (!pageContext.activeSection) setHelp(null);
    setHelp(getHelp(pageContext.activeSection));
  }, [pageContext.activeSection]);

  return (
    <div>
      {help && (
        <HelpCard title={help.title}>
          {Array.isArray(help.text) ? help.text.map((text, i) => <p key={i}>{text}</p>) : <p>{help.text}</p>}
        </HelpCard>
      )}
    </div>
  );
};

export default RightSidebarEdition;
