"use client";

import { Vote } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAnonymousUserId } from "~/hooks/useAnonymousUserId";
import useWindowSize from "~/hooks/useWindowSize";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { themeSelector } from "~/services/Themes/themes.selectors";
import { userSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";

const NorthStar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const userId = useSelector(userSelector)?.userId;
  const currentLanguage = useTranslation().i18n.language;
  const anonymousUserId = useAnonymousUserId();
  const theme = useSelector(themeSelector(dispositif?.theme));

  const { isTablet } = useWindowSize();

  const [didVote, setDidVote] = useState<boolean | null>(null);
  const [currentAvis, setCurrentAvis] = useState<boolean | null>(null);

  const trackData = useMemo(
    () => ({
      language: currentLanguage,
      dispositifId: dispositif?._id,
      type: dispositif?.typeContenu,
      themeId: theme?._id,
    }),
    [currentLanguage, dispositif?._id, dispositif?.typeContenu, theme?._id],
  );

  const sendTrackEvent = (newAvis: boolean | null) => {
    if (newAvis === null) {
      Event("avis", currentAvis ? "positif" : "negatif", { count: -1, ...trackData });
    } else if (currentAvis !== null && currentAvis !== newAvis) {
      Event("avis", newAvis ? "positif" : "negatif", { count: 1, ...trackData });
      Event("avis", newAvis ? "negatif" : "positif", { count: -1, ...trackData });
    } else {
      Event("avis", newAvis ? "positif" : "negatif", { count: 1, ...trackData });
    }
  };

  const addOrUpdateAvis = useCallback(
    ({ vote }: { vote: boolean }) => {
      if (!dispositif) return;

      const newAvis = {
        avis: vote,
        language: currentLanguage,
        userId: userId || undefined,
        anonymousUserId: anonymousUserId || undefined,
      };

      if (
        didVote ||
        (userId || anonymousUserId
          ? dispositif.avis?.find(
              (a) => (userId && a.userId === userId) || (anonymousUserId && a.anonymousUserId === anonymousUserId),
            )
          : false)
      ) {
        API.updateDispositifAvis(dispositif._id.toString(), newAvis)
          .then(() => {
            setDidVote(true);
          })
          .catch((e) => logger.error(e));
      } else {
        API.addDispositifAvis(dispositif._id.toString(), newAvis)
          .then(() => {
            setDidVote(true);
          })
          .catch((e) => logger.error(e));
      }
    },
    [dispositif, currentLanguage, anonymousUserId, userId, didVote],
  );

  const onVoteYes = () => {
    sendTrackEvent(true);
    setCurrentAvis(true);
    addOrUpdateAvis({ vote: true });
  };

  const onVoteNo = () => {
    sendTrackEvent(false);
    setCurrentAvis(false);
    addOrUpdateAvis({ vote: false });
  };

  const onCancel = () => {
    if (!dispositif) return;
    API.deleteDispositifAvis(dispositif._id.toString())
      .then(() => {
        sendTrackEvent(null);
        setDidVote(false);
        setCurrentAvis(null);
      })
      .catch((e) => logger.error(e));
  };

  useEffect(() => {
    if (!dispositif) return;
    const avis =
      userId || anonymousUserId
        ? dispositif.avis?.find(
            (a) => (userId && a.userId === userId) || (anonymousUserId && a.anonymousUserId === anonymousUserId),
          )
        : false;

    if (avis) {
      setCurrentAvis(avis.avis);
      setDidVote(true);
    } else {
      setCurrentAvis(null);
      setDidVote(false);
    }
  }, [dispositif, userId, anonymousUserId]);

  return (
    <Vote
      currentVote={currentAvis}
      onVoteYes={onVoteYes}
      onVoteNo={onVoteNo}
      onCancelYes={onCancel}
      onCancelNo={onCancel}
      isSticky={isTablet}
    />
  );
};

export default NorthStar;
