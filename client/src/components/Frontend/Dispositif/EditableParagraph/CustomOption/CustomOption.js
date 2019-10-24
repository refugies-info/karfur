import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import { EditorState, Modifier, ContentState, convertToRaw } from 'draft-js';
import EVAIcon from '../../../../UI/EVAIcon/EVAIcon';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  toggleBold= () => {
    const { editorState, onChange } = this.props;
    const newState = RichUtils.toggleBlockType(
      editorState,
      "div"
    );
    let selection=newState.getSelection();
    selection.isCollapsed = ()=>true;
    const contentState = Modifier.insertText(
      newState.getCurrentContent(),
      selection,
      "",
      newState.getCurrentInlineStyle(),
    );
    const newHTMLContent =  "<div class='bloc-rouge'><div>Bon à savoir</div>" + draftToHtml(convertToRaw(this.props.editorState.getCurrentContent())) + "</div>"
    const newDraftContent =  ContentState.createFromBlockArray(htmlToDraft(newHTMLContent).contentBlocks);
    console.log(newHTMLContent, draftToHtml(convertToRaw(this.props.editorState.getCurrentContent())), newDraftContent, contentState)
    if (newState) {
      onChange(EditorState.push(editorState, newDraftContent, 'insert-fragment'));
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
