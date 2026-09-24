import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import Toast from "~/components/UI/Toast";
import { Event } from "~/lib/tracking";

export const MobileShareButton = () => {
  const { t } = useTranslation();
  const [showToastLink, setShowToastLink] = useState(false);

  const share = useCallback(async () => {
    Event("Share", "Native", "from french course results");
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url, title: document.title });
      } catch {
        // The user dismissed the share sheet
      }
      return;
    }

    navigator.clipboard.writeText(url).then(
      () => setShowToastLink(true),
      () => setShowToastLink(false),
    );
  }, []);

  const label = t("LearnFrench.share_action", "Partager la liste");

  return (
    <>
      <button
        type="button"
        onClick={share}
        title={label}
        aria-label={label}
        className="border-default-grey text-title-blue-france flex h-11 w-11 items-center justify-center rounded border bg-white"
      >
        <i className="fr-icon-share-forward-line fr-icon--sm" aria-hidden="true" />
      </button>
      <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
        {t("Dispositif.toastShareCopied")}
      </Toast>
    </>
  );
};
