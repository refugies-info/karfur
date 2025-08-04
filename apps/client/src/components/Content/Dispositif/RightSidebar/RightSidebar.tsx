import { DispositifStatus } from "@refugies-info/api-types";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { StructureReceiveDispositif } from "~/components/Pages/dispositif";
import NorthStar from "~/components/Pages/dispositif/NorthStar";
import { useUser } from "~/hooks";
import { cn } from "~/lib/classname";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";
import styles from "./RightSidebar.module.scss";

const RightSidebar = ({ className }: { className?: string }) => {
  const pageContext = useContext(PageContext);
  const isViewMode = useMemo(() => pageContext.mode === "view", [pageContext.mode]);

  const dispositif = useSelector(selectedDispositifSelector);

  // dispositif is waiting for structure approval
  const { user } = useUser();
  const needsApproval = useMemo(() => {
    const userStructureId = user.user?.structures?.[0];
    return (
      !!userStructureId && // user has structure
      dispositif?.mainSponsor?._id.toString() === userStructureId && // dispo is for user structure
      dispositif?.status === DispositifStatus.WAITING_STRUCTURE // and waiting for validation
    );
  }, [dispositif, user]);

  return (
    <div className={cn(styles.container, className)}>
      {!needsApproval ? <>{isViewMode && <NorthStar />}</> : <StructureReceiveDispositif />}
    </div>
  );
};

export default RightSidebar;
