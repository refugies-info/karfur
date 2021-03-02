import React, { Component } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import EVAIcon from "../../../../UI/EVAIcon/EVAIcon";
import { convertFromHTML } from "draft-convert";

class CustomOption extends Component {
  toggleBold = () => {
    const { editorState, onChange } = this.props;
    // const newState = RichUtils.toggleBlockType(
    //   editorState,
    //   "unstyled"
    // );
    const selection = editorState.getSelection();
    // selection.isCollapsed = ()=>true;
    // const contentState = Modifier.insertText(
    //   newState.getCurrentContent(),
    //   selection,
    //   "Bon à savoir",
    //   newState.getCurrentInlineStyle(),
    // );

    // const contentState = editorState.getCurrentContent();
    // const contentStateWithEntity = contentState.createEntity(
    //   "div",
    //   'MUTABLE',
    //   {className: "bloc-rouge"}
    // )
    // const newState = AtomicBlockUtils.insertAtomicBlock(
    //   editorState,
    //   contentStateWithEntity.getLastCreatedEntityKey(),
    //   "test"
    // );
    const anchorKey = selection.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const selectedText = currentContentBlock.getText().slice(start, end);
    const startKey = selection.getStartKey();

    // const newHTMLContent = "<h6>Bon à savoir<p>" + selectedText + "</p></h6>";
    const newHTMLContent = "<h6>" + selectedText + "</h6>";
    const newDraftContent = convertFromHTML(newHTMLContent);

    const rawContent = convertToRaw(currentContent);
    const newRawContent = convertToRaw(newDraftContent) || {};
    const newDraftArray = {
      ...rawContent,
      blocks: rawContent.blocks.reduce(
        (acc, curr) => [
          ...acc,
          ...(curr.key === startKey
            ? newRawContent.blocks.map((y) => ({
                ...y,
                // inlineStyles:[
                //   {
                //     label: 'Redacted',
                //     type: 'REDACTED',
                //     style: {
                //         backgroundColor: 'red',
                //     },
                //   }
                // ],
                // inlineStyleRanges: [
                //   {
                //     "offset": 2,
                //     "length": 9,
                //     "style": "ITALIC"
                //   }
                // ]
              })) || []
            : [curr]),
        ],
        []
      ),
    };
    const newContentState = convertFromRaw(newDraftArray);

    // const trucmuche = Modifier.mergeBlockData(
    //   currentContent,
    //   selection,
    //   Map(htmlToDraft("test").contentBlocks)
    // );

    if (editorState) {
      // onChange(newState);
      onChange(
        EditorState.push(editorState, newContentState, "insert-characters")
      );
    }
  };

  render() {
    return (
      <div className="bloc-droite-alert blc-dr" onClick={this.toggleBold}>
        <EVAIcon name="alert-triangle-outline" />
      </div>
    );
  }
}

export default CustomOption;
