import { templatesIds } from "./templatesIds";
export declare type TemplateName = keyof typeof templatesIds;

declare type Sender = {
  email: string;
  name: string;
};

export interface DynamicData {
  from: Sender;
  to: string;
  cc?: string;
  reply_to?: string;
  dynamicTemplateData?: Record<string, string>;
}
