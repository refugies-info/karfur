import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { isValidDirectiveName, reconstructDirectiveText } from "@refugies-info/markdown-utils";
import { RIAccordion } from "@refugies-info/ui";
import type { TFunction } from "i18next";
import type { Root } from "mdast";
import type { ReactNode } from "react";
import { visit } from "unist-util-visit";
import { getCalloutTranslationKey } from "~/lib/contentParsing";

/**
 * Remark plugin that transforms markdown directives into React components.
 *
 * This plugin bridges remark-directive (which parses :::name{attrs} syntax)
 * with react-markdown (which renders React components).
 *
 * It processes 3 types of directives:
 * - containerDirective: `:::name{attrs}\ncontent\n:::` (block with content)
 * - leafDirective: `::name{attrs}` (single line, no content)
 * - textDirective: `:name{attrs}` (inline in text)
 *
 * For each directive, it sets:
 * - `data.hName`: the component name to render (e.g., "toggle", "important")
 * - `data.hProperties`: the attributes to pass as props (e.g., { title: "..." })
 *
 * Only directives with names in VALID_DIRECTIVE_NAMES are transformed.
 * Unknown directives (including text like "9:00" parsed as :00) are converted
 * to plain text nodes to prevent React errors.
 *
 * @example
 * ```markdown
 * :::toggle{title="My Title"}
 * Content here
 * :::
 * ```
 * Will be rendered as: `<toggle title="My Title">Content here</toggle>`
 * Which can then be mapped to a React component in ReactMarkdown's `components` prop.
 */
export function remarkDirectiveToComponent() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (isValidDirectiveName(node.name)) {
          // Valid directive: transform to component
          const data = node.data || (node.data = {});
          data.hName = node.name;
          data.hProperties = Object.assign({}, node.attributes, {
            class: node.name,
          });
        } else {
          // Invalid directive: convert to plain text
          // Only handle textDirective (inline) - container/leaf directives should not appear
          // in normal content, so we just skip them to avoid breaking the layout
          if (node.type === "textDirective" && parent && typeof index === "number") {
            const textContent = reconstructDirectiveText(node);
            // Replace the directive node with a text node
            parent.children[index] = {
              type: "text",
              value: textContent,
            };
          }
          // For containerDirective and leafDirective with invalid names, we leave them as-is
          // They will be filtered out by ReactMarkdown since no component matches
        }
      }
    });
  };
}

interface DirectiveComponentProps {
  children?: ReactNode;
  title?: string;
  stepNumber?: string | number;
}

/**
 * Creates a mapping of directive names to React components for use with ReactMarkdown.
 *
 * @param t - Translation function from i18next
 * @returns Components object to pass to ReactMarkdown's `components` prop
 *
 * @example
 * ```tsx
 * <ReactMarkdown components={getDirectiveComponents(t)}>
 *   {markdown}
 * </ReactMarkdown>
 * ```
 */
export function getDirectiveComponents(t: TFunction) {
  return {
    // Override p to use span to avoid p-in-p nesting with CallOut
    p: ({ children }: { children?: ReactNode }) => (
      <span className="block mb-4 last:mb-0">{children}</span>
    ),

    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-title-lg font-bold">{children}</h2>
    ),

    // // Apply the same link styling as RI rich-text (.rtri-link)
    a: ({ children, href }: { children?: ReactNode; href?: string }) => {
      const isExternal = !!href && !href.startsWith("mailto:") && !href.startsWith("#");
      return (
        <a
          href={href}
          className="rtri-link"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },

    // :::toggle{title="..." stepNumber=1}
    toggle: ({ children, title, stepNumber }: DirectiveComponentProps) => {
      const parsedStepNumber = stepNumber ? Number.parseInt(stepNumber.toString(), 10) : undefined;
      return (
        <RIAccordion title={title ?? ""} stepNumber={parsedStepNumber}>
          {children ?? <></>}
        </RIAccordion>
      );
    },
    // :::important
    important: ({ children }: DirectiveComponentProps) => {
      return (
        <CallOut className="p-4 ps-6 not-prose">
          <b className="mb-2 block text-xl">{t(getCalloutTranslationKey("important"))}</b>
          <span className="block text-base max-sm:text-lg">{children}</span>
        </CallOut>
      );
    },

    // :::good-to-know
    "good-to-know": ({ children }: DirectiveComponentProps) => {
      return (
        <CallOut className="p-4 ps-6 not-prose">
          <b className="mb-2 block text-xl">{t(getCalloutTranslationKey("info"))}</b>
          <span className="block text-base max-sm:text-lg">{children}</span>
        </CallOut>
      );
    },
  };
}

// Default export for backward compatibility
export default remarkDirectiveToComponent;
