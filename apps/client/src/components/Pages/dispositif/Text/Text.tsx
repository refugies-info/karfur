import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/classname";
import {
  type CalloutSegment,
  getCalloutTranslationKey,
  htmlParsing,
  type TextSegment,
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

  // Remove redundant nested bold/strong tags, keeping only the most semantic element
  // Converts <b><strong>text</strong></b> to <strong>text</strong>
  const cleanNestedBoldTags = (html: string): string => {
    if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
      return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find all <b> tags that directly contain a <strong> tag
    const boldTags = doc.querySelectorAll("b");
    boldTags.forEach((b) => {
      const strong = b.querySelector("strong");
      if (strong && b.children.length === 1) {
        // Replace <b> with its <strong> child
        b.replaceWith(strong);
      }
    });

    // Find all <strong> tags that directly contain a <b> tag
    const strongTags = doc.querySelectorAll("strong");
    strongTags.forEach((strong) => {
      const b = strong.querySelector("b");
      if (b && strong.children.length === 1) {
        // Move <b> content directly into <strong> and remove <b>
        while (b.firstChild) {
          strong.insertBefore(b.firstChild, b);
        }
        b.remove();
      }
    });

    return doc.body.innerHTML;
  };

  // Remove unnecessary <span> tags that have no attributes or classes
  // Keeps spans with meaningful attributes (id, class, data-*, etc.)
  const cleanUnnecessarySpans = (html: string): string => {
    if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
      return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find all <span> tags
    const spans = Array.from(doc.querySelectorAll("span"));

    spans.forEach((span) => {
      // Check if span has any meaningful attributes
      const hasAttributes = Array.from(span.attributes).some((attr) => {
        // Keep spans with meaningful attributes
        return attr.name !== "dir" && attr.value.trim() !== "";
      });

      // If no meaningful attributes, unwrap the span
      if (!hasAttributes) {
        while (span.firstChild) {
          span.parentNode?.insertBefore(span.firstChild, span);
        }
        span.remove();
      }
    });

    return doc.body.innerHTML;
  };

  const convertedContent = useMemo(() => {
    if (!props.html) {
      return props.children;
    }

    const translated = translationParsing(props.children || "", [
      {
        nodeAttr: /data-callout=["']info["']/,
        translation: t(getCalloutTranslationKey("info")),
      },
      {
        nodeAttr: /data-callout=["']important["']/,
        translation: t(getCalloutTranslationKey("important")),
      },
    ]);

    if (!hasMounted) {
      return translated;
    }

    const listItemsTransformed = transformListItems(translated);
    const boldTagsCleaned = cleanNestedBoldTags(listItemsTransformed);
    return cleanUnnecessarySpans(boldTagsCleaned);
  }, [hasMounted, props.children, props.html, t]);

  // Use simple content for server-side rendering or before mounting
  const { contentSegments } =
    hasMounted && props.html
      ? htmlParsing(convertedContent as string)
      : {
          contentSegments: [{ type: "text", content: convertedContent as string }],
        };

  return props.html ? (
    <div
      data-section={props.id}
      className={cn(
        styles.content,
        pageContext.activeSection === props.id && styles.highlighted,
        props.className,
      )}
    >
      {contentSegments.map((segment, index) => {
        if (segment.type === "text") {
          const textSegment = segment as TextSegment;
          return (
            <div key={`text-${index}`} dangerouslySetInnerHTML={{ __html: textSegment.content }} />
          );
        } else if (segment.type === "callout") {
          const calloutSegment = segment as CalloutSegment;

          return (
            <CallOut key={`callout-${calloutSegment.calloutType}-${index}`} className="p-4 ps-6">
              <b className="mb-2 block text-xl">{calloutSegment.title}</b>
              <div
                className="not-prose text-base max-sm:text-lg"
                dangerouslySetInnerHTML={{ __html: calloutSegment.content }}
              />
            </CallOut>
          );
        }
        return null;
      })}
    </div>
  ) : (
    <>
      <span
        className={pageContext.activeSection === props.id ? styles.highlighted : ""}
        data-section={props.id}
      >
        {convertedContent}
      </span>
    </>
  );
};

export default Text;
