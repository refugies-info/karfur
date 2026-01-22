import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
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
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});

        data.hName = node.name;
        data.hProperties = Object.assign({}, node.attributes, {
          class: node.name,
        });
      }
    });
  };
}

interface DirectiveComponentProps {
  children?: ReactNode;
  title?: string;
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

    // :::toggle{title="..."}
    toggle: ({ children, title }: DirectiveComponentProps) => {
      return <Accordion label={title}>{children ?? <></>}</Accordion>;
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
