import { cls } from "lib/classname";
import Button from "components/UI/Button";
import styles from "./SuggestionsNavButtons.module.scss";

interface Props {
  index: number;
  max: number;
  validatedIndex: number | null;
  suggestionsCount: number;
  isExpert: boolean;
  prev: () => void;
  next: () => void;
  validateSuggestion: () => void;
}

const SuggestionsNavButtons = ({
  index,
  max,
  validatedIndex,
  suggestionsCount,
  isExpert,
  prev,
  next,
  validateSuggestion,
}: Props) => {
  return (
    <div className="d-flex">
      {index >= 0 && (
        // previous
        <Button
          className={cls(styles.nav, "me-4")}
          priority="tertiary no outline"
          onClick={(e: any) => {
            e.preventDefault();
            prev();
          }}
          evaIcon="arrow-back-outline"
        ></Button>
      )}
      {suggestionsCount > 0 && index < max - 1 && (
        // next
        <Button
          className={styles.nav}
          priority="tertiary no outline"
          onClick={(e: any) => {
            e.preventDefault();
            next();
          }}
          evaIcon="arrow-forward-outline"
        ></Button>
      )}
      {index === max - 1 && (
        // see google translate
        <Button
          className={styles.nav}
          priority="tertiary no outline"
          onClick={(e: any) => {
            e.preventDefault();
            next();
          }}
          evaIcon="arrow-forward-outline"
          iconPosition="right"
        >
          Voir Google Translate
        </Button>
      )}
      {isExpert && suggestionsCount > 0 && index < max && index >= 0 && (
        // validate
        <Button
          priority="secondary"
          onClick={(e: any) => {
            e.preventDefault();
            validateSuggestion();
          }}
          evaIcon="checkmark-outline"
          className={cls(styles.validate, index === validatedIndex && styles.validated, "ms-2")}
        ></Button>
      )}
    </div>
  );
};

export default SuggestionsNavButtons;
