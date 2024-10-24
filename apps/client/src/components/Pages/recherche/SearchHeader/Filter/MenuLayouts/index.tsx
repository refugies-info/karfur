import React from "react";
export type LayoutProps = {
  label: string;
  icon?: string;
  value: string[] | null;
  resetOptions: () => void;
  gaType: string;
  resultsNumber?: number;
  children: React.ReactNode;
  filterCount?: number | null;
  tooltip?: { trigger: string; text: string } | null | undefined;
};
export { DialogMenuLayout, DialogMenuLayoutTitle } from "./DialogMenuLayout";
export { DropDownMenuLayout } from "./DropDownMenuLayout";
