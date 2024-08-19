import { useEffect, useState } from "react";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

interface FocusPluginProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

const FocusPlugin = (props: FocusPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          props.onFocus && props.onFocus();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          props.onBlur && props.onBlur();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, props]);

  return null;
};

export default FocusPlugin;
