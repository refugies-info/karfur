import { useSelector } from "react-redux";
import { Id } from "@refugies-info/api-types";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { langueSelector } from "services/Langue/langue.selectors";

interface Props {
  id: Id;
}

const LanguageBadge = (props: Props) => {
  const language = useSelector(langueSelector(props.id));
  return language ? (
    <Tag linkProps={{ href: "#" }} className="me-2">
      {language.langueFr}
    </Tag>
  ) : null;
};

export default LanguageBadge;
