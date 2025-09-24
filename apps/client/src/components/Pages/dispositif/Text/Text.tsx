import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { cn } from "~/lib/classname";
import {
  CalloutSegment,
  getCalloutTranslationKey,
  htmlParsing,
  TextSegment,
  translationParsing,
} from "~/lib/contentParsing";
import PageContext from "~/utils/pageContext";
import styles from "./Text.module.scss";

interface Props {
  id: string;
  children: string;
  html?: boolean;
  className?: string;
}

const Text = (props: Props) => {
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  const convertedContent = props.html
    ? translationParsing(props.children || "", [
        { nodeAttr: /data-callout=["']info["']/, translation: t(getCalloutTranslationKey("info")) },
        { nodeAttr: /data-callout=["']important["']/, translation: t(getCalloutTranslationKey("important")) },
      ])
    : props.children;

  const isClient = typeof window !== "undefined";

  const { contentSegments } =
    isClient && props.html
      ? htmlParsing(convertedContent as string)
      : { contentSegments: [{ type: "text", content: convertedContent as string }] };

  return props.html ? (
    <div
      data-section={props.id}
      className={cn(styles.content, pageContext.activeSection === props.id && styles.highlighted, props.className)}
    >
      {contentSegments.map((segment, index) => {
        if (segment.type === "text") {
          const textSegment = segment as TextSegment;
          return <div key={`text-${index}`} dangerouslySetInnerHTML={{ __html: textSegment.content }} />;
        } else if (segment.type === "callout") {
          const calloutSegment = segment as CalloutSegment;
          const iconId = calloutSegment.calloutType === "important" ? "fr-icon-warning-fill" : "ri-information-line";

          return (
            <CallOut
              key={`callout-${calloutSegment.calloutType}-${index}`}
              title={calloutSegment.title}
              iconId={iconId}
              colorVariant={calloutSegment.calloutType === "important" ? "yellow-tournesol" : "blue-cumulus"}
            >
              <p className="not-prose" dangerouslySetInnerHTML={{ __html: calloutSegment.content }} />
            </CallOut>
          );
        }
        return null;
      })}
    </div>
  ) : (
    <>
      <span className={pageContext.activeSection === props.id ? styles.highlighted : ""} data-section={props.id}>
        {convertedContent}
      </span>
    </>
  );
};

export default Text;
