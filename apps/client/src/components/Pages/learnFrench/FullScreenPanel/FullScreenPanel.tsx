import { useTranslation } from "next-i18next";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { useIsDesktopLayout } from "~/hooks/learnFrench/useIsDesktopLayout";

interface Props {
  open: boolean;
  title: string;
  resultCount: number;
  onClose: () => void;
  onReset: () => void;
  children: ReactNode;
}

export const FullScreenPanel = (props: Props) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { open, onClose } = props;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const isDesktopLayout = useIsDesktopLayout();
  useEffect(() => {
    if (open && isDesktopLayout) onClose();
  }, [open, isDesktopLayout, onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-white p-0 open:flex open:flex-col"
    >
      <div className="border-default-grey flex shrink-0 items-center justify-between border-b py-2 ps-4 pe-2">
        <h2 id={titleId} className="text-h5 mb-0 font-bold">
          {props.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          title={t("close", "Fermer")}
          aria-label={t("close", "Fermer")}
          className="flex h-11 w-11 items-center justify-center"
        >
          <i className="fr-icon-close-line" aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {props.children}
      </div>

      <div className="border-default-grey flex shrink-0 items-center justify-between gap-3 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={props.onReset}
          className="text-title-blue-france inline-flex min-h-11 items-center gap-2 px-2 text-base font-medium"
        >
          <i className="ri-eraser-line fr-icon--sm" aria-hidden="true" />
          {t("LearnFrench.filters_reset", "Effacer")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-action-high-blue-france min-h-11 px-6 text-base font-medium text-white"
        >
          {t("Recherche.seeButton", "Voir les {{count}} fiches", { count: props.resultCount })}
        </button>
      </div>
    </dialog>
  );
};
