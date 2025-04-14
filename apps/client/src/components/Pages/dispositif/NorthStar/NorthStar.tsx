import { Vote } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";

const NorthStar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const avis = useMemo(() => dispositif?.avis || [], [dispositif]);
  const userId = useSelector(userSelector)?.userId;

  // get current locale
  const currentLanguage = useTranslation().i18n.language;

  // eslint-disable-next-line no-console
  console.log(currentLanguage);

  const [didVote, setDidVote] = useState(!!avis.find((m) => m.userId === userId));

  const updateLocalStorage = (id: string) => {
    const storedDispositifId = localStorage.getItem("avis");
    localStorage.setItem("avis", (storedDispositifId ? `${storedDispositifId},` : "") + id);
  };

  const onVoteYes = useCallback(() => {
    if (!dispositif) return;
    Event("avis", "positif", currentLanguage);
    API.addDispositifAvis(dispositif._id.toString(), { avis: true })
      .then(() => {
        setDidVote(true);
        updateLocalStorage(dispositif._id.toString());
      })
      .catch((e) => logger.error(e));
  }, [dispositif, currentLanguage]);

  const onVoteYesCancel = useCallback(() => {
    if (!dispositif) return;
    API.deleteDispositifAvis(dispositif._id.toString())
      .then(() => {
        setDidVote(false);
        updateLocalStorage(dispositif._id.toString());
      })
      .catch((e) => logger.error(e));
  }, [dispositif]);

  const onVoteNo = useCallback(() => {
    if (!dispositif) return;
    Event("avis", "negatif", currentLanguage);
    API.addDispositifAvis(dispositif._id.toString(), { avis: false })
      .then(() => {
        setDidVote(true);
        updateLocalStorage(dispositif._id.toString());
      })
      .catch((e) => logger.error(e));
  }, [dispositif, currentLanguage]);

  const onVoteNoCancel = useCallback(() => {
    if (!dispositif) return;
    API.deleteDispositifAvis(dispositif._id.toString())
      .then(() => {
        setDidVote(false);
        updateLocalStorage(dispositif._id.toString());
      })
      .catch((e) => logger.error(e));
  }, [dispositif]);

  const onVoteUpdate = useCallback(
    (vote: "yes" | "no") => {
      if (!dispositif) return;
      API.updateDispositifAvis(dispositif._id.toString(), { avis: vote })
        .then(() => {
          setDidVote(true);
          updateLocalStorage(dispositif._id.toString());
        })
        .catch((e) => logger.error(e));
    },
    [dispositif],
  );

  return <Vote onVoteYes={onVoteYes} onVoteNo={onVoteNo} onCancelYes={onVoteYesCancel} onCancelNo={onVoteNoCancel} />;
};

export default NorthStar;
