"use client";

import { Vote } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAnonymousUserId } from "~/hooks/useAnonymousUserId";
import useWindowSize from "~/hooks/useWindowSize";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";

const NorthStar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const userId = useSelector(userSelector)?.userId;
  const currentLanguage = useTranslation().i18n.language;
  const anonymousUserId = useAnonymousUserId();

  const { isTablet } = useWindowSize();

  const [didVote, setDidVote] = useState<boolean | null>(null);
  const [currentAvis, setCurrentAvis] = useState<boolean | null>(null);

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

  const onVoteYes = useCallback(() => {
    Event("avis", "positif", { count: 1, language: currentLanguage });
    setCurrentAvis(true);
    addOrUpdateAvis({ vote: true });
  }, [currentLanguage, addOrUpdateAvis]);

  const onVoteNo = useCallback(() => {
    Event("avis", "negatif", { count: 1, language: currentLanguage });
    setCurrentAvis(false);
    addOrUpdateAvis({ vote: false });
  }, [currentLanguage, addOrUpdateAvis]);

  const onCancel = useCallback(() => {
    if (!dispositif) return;
    API.deleteDispositifAvis(dispositif._id.toString())
      .then(() => {
        Event("avis", currentAvis ? "positif" : "negatif", { count: -1, language: currentLanguage });
        setDidVote(false);
        setCurrentAvis(null);
      })
      .catch((e) => logger.error(e));
  }, [dispositif, currentAvis, currentLanguage]);

  useEffect(() => {
    if (!dispositif) return;

    console.log("dispositif", dispositif.avis);
    console.log("userId", userId);
    console.log("anonymousUserId", anonymousUserId);

    // Find matching avis based on userId or anonymousUserId
    // Will be false if there's no userId and no anonymousUserId
    // Will be true if there's an avis.userId equal to userId OR an avis.anonymousUserId equal to anonymousUserId
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
