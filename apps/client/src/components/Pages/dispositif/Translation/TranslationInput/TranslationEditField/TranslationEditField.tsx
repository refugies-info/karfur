import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import RichTextInput from "components/UI/RichTextInput";
import styles from "./TranslationEditField.module.scss";

interface Props {
  isHTML: boolean;
  section: string;
  validate: (section: string, value: { text?: string; unfinished?: boolean }) => void;
  isRTL: boolean;
  loading: boolean;
  maxLength?: number;
  className?: string;
}

const TranslationEditField = ({ isHTML, section, validate, isRTL, loading, maxLength, className }: Props) => {
  const value: string = useWatch({ name: `translated.${section}` });
  const remainingChars = useMemo(() => (!maxLength ? null : maxLength - (value || "").length), [value, maxLength]);

  return !isHTML ? (
    <>
      <textarea
        className={className}
        disabled={loading}
        value={value}
        onChange={(e) => validate(section, { text: e.target.value })}
        autoFocus
        maxLength={maxLength}
        dir={isRTL ? "rtl" : "ltr"}
      />
      {maxLength && (
        <p className={styles.error}>
          <EVAIcon name="alert-triangle" size={16} fill={styles.lightTextDefaultError} className="me-2" />
          {remainingChars} sur 110 caractères restants
        </p>
      )}
    </>
  ) : (
    <RichTextInput value={value} onChange={(html) => validate(section, { text: html })} className={styles.richtext} />
  );
};

export default TranslationEditField;
