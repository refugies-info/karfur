import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Id } from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import { cls } from "~/lib/classname";
import { langueSelector } from "~/services/Langue/langue.selectors";
import styles from "./LanguageBadge.module.scss";

interface Props {
  id: Id;
}

const LanguageBadge = (props: Props) => {
  const language = useSelector(langueSelector(props.id));
  return language ? <Tag className={cls(styles.tag, "me-2")}>{language.langueFr}</Tag> : null;
};

export default LanguageBadge;
