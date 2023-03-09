import { DOMConversionMap, DOMConversionOutput, EditorConfig, ElementNode, LexicalNode, NodeKey, SerializedElementNode, Spread } from "lexical";
import { getCalloutTranslationKey } from "lib/contentParsing";
import { i18n } from "next-i18next";
export type CalloutLevel = "info" | "important";

type SerializedCalloutNode = Spread<
  {
    type: "callout";
    version: 1;
    level: CalloutLevel;
  },
  SerializedElementNode
>;

function convertCalloutElement(domNode: HTMLElement): DOMConversionOutput | null {
  const level = domNode.getAttribute("data-callout");

  if (level !== null) {
    // eslint-disable-next-line no-use-before-define
    const node = $createCalloutNode(level as CalloutLevel);
    return {
      node,
    };
  }

  return null;
}

export class CalloutNode extends ElementNode {
  __level: "info" | "important";

  constructor(level: CalloutLevel, key?: NodeKey) {
    super(key);
    this.__level = level;
  }

  static getType(): string {
    return "callout";
  }

  static clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__level, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.classList.add("callout", `callout--${this.__level}`);
    dom.setAttribute("data-callout", this.__level);
    dom.setAttribute("data-title", i18n?.t(getCalloutTranslationKey(this.__level)) || "");

    return dom;
  }

  updateDOM(prevNode: CalloutNode, dom: HTMLElement): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-callout")) {
          return null;
        }
        return {
          conversion: convertCalloutElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
    // eslint-disable-next-line no-use-before-define
    const node = $createCalloutNode(serializedNode.level);
    return node;
  }

  exportJSON(): SerializedCalloutNode {
    return {
      ...super.exportJSON(),
      type: "callout",
      version: 1,
      level: this.__level
    };
  }

  setLevel(level: CalloutLevel): void {
    const writable = this.getWritable();
    writable.__level = level;
  }

  getLevel(): CalloutLevel {
    return this.__level;
  }
}

export function $createCalloutNode(level: CalloutLevel): CalloutNode {
  return new CalloutNode(level);
}

export function $isCalloutNode(node: LexicalNode | null | undefined): node is CalloutNode {
  return node instanceof CalloutNode;
}
