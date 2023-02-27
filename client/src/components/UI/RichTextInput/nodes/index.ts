import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import type { Klass, LexicalNode } from "lexical";
import { CalloutNode } from '../plugins/CalloutPlugin/CalloutNode';

const nodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  AutoLinkNode,
  LinkNode,
  CalloutNode,
];

export default nodes;
