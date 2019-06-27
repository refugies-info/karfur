import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import EVAIcon from '../../../../UI/EVAIcon/EVAIcon';

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addStar = () => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '⭐',
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  render() {
    return (
      <div onClick={this.addStar} className="bloc-droite-alert blc-dr">
        <EVAIcon name="alert-triangle-outline" />
      </div>
    );
  }
}

export default CustomOption;
