import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
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
  const [hasMounted, setHasMounted] = useState(false);

  // Mark component as mounted after initial render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const convertedContent = props.html
    ? translationParsing(props.children || "", [
        { nodeAttr: /data-callout=["']info["']/, translation: t(getCalloutTranslationKey("info")) },
        { nodeAttr: /data-callout=["']important["']/, translation: t(getCalloutTranslationKey("important")) },
      ])
    : props.children;

  // Use simple content for server-side rendering or before mounting
  const { contentSegments } =
    hasMounted && props.html
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

          return (
            <CallOut key={`callout-${calloutSegment.calloutType}-${index}`} className="p-4 ps-6">
              <b className="mb-2 block text-xl">{calloutSegment.title}</b>
              <div className="not-prose" dangerouslySetInnerHTML={{ __html: calloutSegment.content }} />
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
