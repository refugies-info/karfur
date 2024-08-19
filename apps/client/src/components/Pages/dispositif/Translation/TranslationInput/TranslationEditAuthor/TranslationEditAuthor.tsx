import { cls } from "lib/classname";
import { useUser } from "hooks";
import { Suggestion } from "hooks/dispositif";
import Button from "components/UI/Button";
import { FooterStatus } from "../functions";
import UserSuggest from "../UserSuggest";
import styles from "./TranslationEditAuthor.module.scss";

interface Props {
  index: number;
  max: number;
  footerStatus: FooterStatus;
  suggestions: Suggestion[];
  deleteTranslation: () => void;
}

const TranslationEditAuthor = ({ index, max, footerStatus, suggestions, deleteTranslation }: Props) => {
  const { user } = useUser();

  return (
    <span className={styles.user}>
      {index === -1 ? (
        // edit my suggestion
        <UserSuggest username={user.user?.username || ""} picture="me" isBig />
      ) : index === max ? (
        // view google translate auto translation
        <UserSuggest username="Google Translate" picture="google" isBig />
      ) : (
        // view user suggestion
        <UserSuggest
          username={suggestions[index]?.author.username || ""}
          picture="user"
          pictureUrl={suggestions[index]?.author.picture?.secure_url}
          isBig
        />
      )}
      <span className={cls(styles.proposal, styles[footerStatus.status])}>{footerStatus.text}</span>
      {index === -1 && (
        <Button
          priority="secondary"
          evaIcon="trash-2-outline"
          className={cls(styles.delete, "ms-2")}
          onClick={(e: any) => {
            e.preventDefault();
            deleteTranslation();
          }}
        />
      )}
    </span>
  );
};

export default TranslationEditAuthor;
