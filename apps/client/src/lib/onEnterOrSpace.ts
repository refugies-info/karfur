import { KeyboardEvent } from "react";

export const onEnterOrSpace = (e: KeyboardEvent<HTMLButtonElement | HTMLDivElement>, callback: () => void, extraKeys?: KeyboardEvent<HTMLButtonElement | HTMLDivElement>["key"][]) => {
  const keys = ["Enter", "Spacebar", " ", ...(extraKeys || [])];
  if (keys.includes(e.key)) {
    e.preventDefault();
    callback();
  }
}
