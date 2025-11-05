import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useMemo, useState } from "react";
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

  // Wrap content of li elements with value attribute in a div
  const transformListItems = (html: string): string => {
    if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
      return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const listItems = doc.querySelectorAll("li[value]");

    listItems.forEach((li) => {
      const firstElement = li.firstElementChild;
      const hasOnlyWhitespaceTextNodes = Array.from(li.childNodes).every((node) => {
        if (node.nodeType !== Node.TEXT_NODE) {
          return true;
        }
        return node.textContent?.trim() === "";
      });

      if (
        firstElement?.tagName.toLowerCase() === "div" &&
        Array.from(li.children).length === 1 &&
        hasOnlyWhitespaceTextNodes
      ) {
        return;
      }

      const wrapper = doc.createElement("div");
      while (li.firstChild) {
        wrapper.appendChild(li.firstChild);
      }
      li.appendChild(wrapper);
    });

    return doc.body.innerHTML;
  };

  const convertedContent = useMemo(() => {
    if (!props.html) {
      return props.children;
    }

    const translated = translationParsing(props.children || "", [
      { nodeAttr: /data-callout=["']info["']/, translation: t(getCalloutTranslationKey("info")) },
      { nodeAttr: /data-callout=["']important["']/, translation: t(getCalloutTranslationKey("important")) },
    ]);

    if (!hasMounted) {
      return translated;
    }

    return transformListItems(translated);
  }, [hasMounted, props.children, props.html, t]);

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
          const iconId = calloutSegment.calloutType === "important" ? "fr-icon-warning-fill" : "ri-information-line";

          return (
            <CallOut
              key={`callout-${calloutSegment.calloutType}-${index}`}
              title={calloutSegment.title}
              iconId={iconId}
              colorVariant={calloutSegment.calloutType === "important" ? "yellow-tournesol" : "blue-cumulus"}
            >
              <span className="not-prose" dangerouslySetInnerHTML={{ __html: calloutSegment.content }} />
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
