import { cn } from "@refugies-info/ui";
import { useContext } from "react";
import PageContext from "~/utils/pageContext";
import { RichTextEdit } from "../Edition";
import Text from "../Text";
import styles from "./RichText.module.scss";

interface Props {
  id: string;
  value: string | undefined;
}

/**
 * Shows a rich text as html, or the form component of the RichText. Can be used for VIEW or EDIT mode.
 */
const RichText = (props: Props) => {
  const pageContext = useContext(PageContext);

  return (
    <div className={cn(pageContext.mode !== "edit" && "prose no-dsfr", styles.content)}>
      {pageContext.mode !== "edit" ? (
        <Text id={props.id} html calloutTitleAs="h2">
          {props.value || ""}
        </Text>
      ) : (
        <RichTextEdit id={props.id} />
      )}
    </div>
  );
};

export default RichText;
