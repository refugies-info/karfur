import { useTranslation } from "next-i18next";
import type { Label } from "~/lib/validatePassword";

// The symbols are the same in every language, so they live here and not in the
// translation files.
const SPECIAL_CHARACTERS = "(!, @, #, $, &, *)";

interface Props {
  label: Label;
}

/**
 * Text of one password rule. For the special character rule, screen readers get
 * the symbols spelled out: VoiceOver skips "!" at its default punctuation level.
 */
const PasswordCriteriaLabel = ({ label }: Props) => {
  const { t } = useTranslation();
  if (label !== "Register.criteria_special") return <>{t(label)}</>;

  const spoken = t("Register.criteria_special_spoken", { defaultValue: "" });
  return (
    <>
      {t(label)} <span aria-hidden={spoken ? "true" : undefined}>{SPECIAL_CHARACTERS}</span>
      {spoken && <span className="sr-only">({spoken})</span>}
    </>
  );
};

export default PasswordCriteriaLabel;
