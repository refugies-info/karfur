import React from "react";
import { EditorState, convertToRaw, convertFromRaw, ContentState, RawDraftContentState, RawDraftContentBlock } from "draft-js";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { convertFromHTML } from "draft-convert";

interface Props {
  editorState: EditorState
}

const CustomOption = (props: Props) => {
  const toggleBold = () => {
    const selection = props.editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = props.editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const selectedText = currentContentBlock.getText().slice(start, end);
    const startKey = selection.getStartKey();

    // const newHTMLContent = "<h6>Bon à savoir<p>" + selectedText + "</p></h6>";
    const newHTMLContent = "<h6>" + selectedText + "</h6>";
    const newDraftContent: ContentState = convertFromHTML(newHTMLContent);

    const rawContent: RawDraftContentState = convertToRaw(currentContent);
    const newRawContent = convertToRaw(newDraftContent) || {};
    const newDraftArray = {
      ...rawContent,
      blocks: rawContent.blocks.reduce(
        (acc, curr) => [
          ...acc,
          ...(curr.key === startKey
            ? newRawContent.blocks.map((y) => ({
                ...y,
              })) || []
            : [curr]),
        ],
        [] as RawDraftContentBlock[]
      ),
    };
    const newContentState = convertFromRaw(newDraftArray);

    if (props.editorState) {
      // onChange(newState);
      EditorState.push(props.editorState, newContentState, "insert-characters")
    }
  };

  return (
    <div className="bloc-droite-alert blc-dr" onClick={toggleBold}>
      <EVAIcon name="alert-triangle-outline" />
    </div>
  );
}

export default CustomOption;
