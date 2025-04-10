import { RoleName } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import ContributorCard from "./ContributorCard";

/**
 * List of contributors of the dispositif
 */
const Contributors = () => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const participants = useMemo(() => {
    return (dispositif?.participants || []).sort((a, b) => {
      if (a.roles?.includes(RoleName.ADMIN)) return -1;
      if (b.roles?.includes(RoleName.ADMIN)) return 1;
      return 0;
    });
  }, [dispositif?.participants]);

  return (
    <div className="bg-alt-blue-france flex w-[44rem] flex-col gap-14 p-14 shadow-(--shadow-ri)">
      <p className="text-title-grey mb-0 text-[2rem] leading-[2.5rem] font-bold">
        {t("Dispositif.contributors", { count: participants.length })}
      </p>
      <div className="flex flex-wrap gap-4">
        {participants.map((user, i) => (
          <ContributorCard key={i} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Contributors;
