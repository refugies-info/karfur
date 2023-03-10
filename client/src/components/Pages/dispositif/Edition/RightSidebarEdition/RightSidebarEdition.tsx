import React from "react";
import HelpCard from "../HelpCard";
import styles from "./RightSidebarEdition.module.scss";

const RightSidebarEdition = () => {
  return (
    <div>
      <HelpCard title="Le titre résume l'action">
        <p>Commencez par un verbe à l'infinitif. Par exemple : “Passer son permis”.</p>
        <p>
          Demandez-vous ce qui est vraiment important dans cette fiche : ne choisissez pas un titre trop long ou trop
          vague.
        </p>
      </HelpCard>
    </div>
  );
};

export default RightSidebarEdition;
