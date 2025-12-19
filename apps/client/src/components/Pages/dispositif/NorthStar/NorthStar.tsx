"use client";

import { useWindowSize, Vote } from "@refugies-info/ui";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import Toast from "~/components/UI/Toast";
import { useAnonymousUserId } from "~/hooks/useAnonymousUserId";
import { customEvent } from "~/lib/tracking";
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
  const { t } = useTranslation();
  const announce = useAnnounce();

  const { isDesktop, isLargeDesktop } = useWindowSize();

  const [didVote, setDidVote] = useState<boolean | null>(null);
  const [currentAvis, setCurrentAvis] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);

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
      customEvent("avis", { valeur: currentAvis ? "positif" : "negatif", count: -1, ...trackData });
    } else if (currentAvis !== null && currentAvis !== newAvis) {
      customEvent("avis", { valeur: newAvis ? "positif" : "negatif", count: 1, ...trackData });
      customEvent("avis", { valeur: !newAvis ? "positif" : "negatif", count: -1, ...trackData });
    } else {
      customEvent("avis", { valeur: newAvis ? "positif" : "negatif", count: 1, ...trackData });
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
          .catch((e) => {
            logger.error(e);
            setError(true);
          });
      } else {
        API.addDispositifAvis(dispositif._id.toString(), newAvis)
          .then(() => {
            setDidVote(true);
          })
          .catch((e) => {
            logger.error(e);
            setError(true);
          });
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
    API.deleteDispositifAvis(dispositif._id.toString(), {
      anonymousUserId: anonymousUserId || undefined,
      userId: userId || undefined,
    })
      .then(() => {
        sendTrackEvent(null);
        setDidVote(false);
        setCurrentAvis(null);
      })
      .catch((e) => {
        logger.error(e);
        setError(true);
      });
  };

  useEffect(() => {
    if (!dispositif) return;
    const avis =
      userId || anonymousUserId
        ? dispositif.avis?.find(
            (a) =>
              (userId && a.userId === userId) ||
              (anonymousUserId && a.anonymousUserId && a.anonymousUserId === anonymousUserId),
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

  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
      setDidVote(false);
    }
  }, [error]);

  return (
    <>
      <Vote
        className="sticky top-8 z-20"
        currentVote={currentAvis}
        onVoteYes={onVoteYes}
        onVoteNo={onVoteNo}
        onCancelYes={onCancel}
        onCancelNo={onCancel}
        isSticky={!isLargeDesktop}
        error={error}
        onVoteAnnounce={announce}
      />
      <Toast open={showErrorToast} closeCallback={() => setShowErrorToast(false)} type="error">
        {t("ui.northStar_error", "Une erreur est survenue lors de la soumission de votre avis")}
      </Toast>
    </>
  );
};

export default NorthStar;
