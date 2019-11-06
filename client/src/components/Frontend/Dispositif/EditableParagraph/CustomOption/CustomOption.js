import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { RichUtils, AtomicBlockUtils } from 'draft-js';
import { EditorState, Modifier, ContentState, convertToRaw, SelectionState,convertFromRaw } from 'draft-js';
import EVAIcon from '../../../../UI/EVAIcon/EVAIcon';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Map } from 'immutable';
import {stateFromHTML} from 'draft-js-import-html';
import { convertFromHTML } from 'draft-convert';

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  toggleBold= () => {
    const { editorState, onChange } = this.props;
    // const newState = RichUtils.toggleBlockType(
    //   editorState,
    //   "unstyled"
    // );
    const selection=editorState.getSelection();
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
    const initial_text = editorState.getCurrentContent().getPlainText();
    const selectedText = currentContentBlock.getText().slice(start, end);
    const startText = initial_text.slice(0, start - 1);
    const endText = initial_text.slice(end + 1, initial_text.length);
    const startKey = selection.getStartKey();

    // const newHTMLContent = "<h6>Bon à savoir<p>" + selectedText + "</p></h6>";
    const newHTMLContent = "<h6>" + selectedText + "</h6>";
    const newDraftContent =  convertFromHTML(newHTMLContent);

    const rawContent = convertToRaw(currentContent);
    const newRawContent = convertToRaw(newDraftContent) || {};
    const newDraftArray = {...rawContent, blocks: rawContent.blocks.reduce((acc, curr) => [...acc, ...(curr.key === startKey ? (newRawContent.blocks.map(y => ({
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
    })) || []) : [curr]) ] , [])     }
    const newContentState = convertFromRaw(newDraftArray);
    // console.log(draftToHtml(convertToRaw(newDraftContent)))
    // console.log(draftToHtml(convertToRaw(this.props.editorState.getCurrentContent())), newDraftContent)

    // console.log(convertToRaw(currentContent), Map(htmlToDraft(newHTMLContent).contentBlocks), selection, currentContent.getBlockForKey(startKey))

    // const trucmuche = Modifier.mergeBlockData(
    //   currentContent,
    //   selection,
    //   Map(htmlToDraft("test").contentBlocks)
    // );

    // console.log(convertToRaw(editorState.getCurrentContent()), htmlToDraft(newHTMLContent).contentBlocks)
    // // const contentState = currentContent.replaceEntityData(
    // //   currentContent.getLastCreatedEntityKey(),
    // //   htmlToDraft(newHTMLContent).contentBlocks
    // // );
    // console.log(convertToRaw(trucmuche))
    if (editorState) {
      // onChange(newState);
      onChange(EditorState.push(editorState, newContentState, 'insert-characters'));
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



// addStar = () => {
//   const { editorState, onChange } = this.props;
//   const contentState = Modifier.replaceText(
//     editorState.getCurrentContent(),
//     editorState.getSelection(),
//     '⭐',
//     editorState.getCurrentInlineStyle(),
//   );
//   onChange(EditorState.push(editorState, contentState, 'insert-characters'));
// };

// render() {
//   return (
//     <div onClick={this.addStar} className="bloc-droite-alert blc-dr">
//       <EVAIcon name="alert-triangle-outline" />
//     </div>
//   );
// }

export default CustomOption;
