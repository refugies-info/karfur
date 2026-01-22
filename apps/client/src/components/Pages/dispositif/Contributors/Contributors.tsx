import { DispositifOrigin, RoleName } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import LinkedThemes from "~/components/Pages/dispositif/LinkedThemes";
import SourceCard from "~/components/Pages/dispositif/SourceCard";
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
    <div className="lg:bg-alt-blue-france lg:shadow-ri flex w-full flex-col p-4 lg:p-14 print:hidden">
      <LinkedThemes className="mb-10 max-sm:mt-10" />

      {dispositif?.origin && dispositif.origin !== DispositifOrigin.RI && (
        <SourceCard origin={dispositif.origin} />
      )}

      <h2
        className="text-title-grey mb-6 text-[2rem] leading-[2.5rem] font-bold md:mb-8"
        id="contributors"
      >
        {t("Dispositif.contributors", { count: participants.length })}
      </h2>
      <ul
        className="grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3"
        aria-labelledby="contributors"
      >
        {participants.map((user, i) => (
          <li key={i}>
            <ContributorCard user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contributors;
