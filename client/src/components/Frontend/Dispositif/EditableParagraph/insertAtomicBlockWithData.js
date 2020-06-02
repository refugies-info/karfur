import {
  BlockMapBuilder,
  CharacterMetadata,
  ContentBlock,
  Modifier,
  EditorState,
  genKey,
} from "draft-js";

import { List, Repeat } from "immutable";

const insertAtomicBlockWithData = (
  editorState,
  entityKey,
  blockData,
  character
) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemovalContentState = Modifier.removeRange(
    contentState,
    selectionState,
    "backwarad"
  );

  const targetSelectionState = afterRemovalContentState.getSelectionAfter();
  const afterSplitContentState = Modifier.splitBlock(
    afterRemovalContentState,
    targetSelectionState
  );
  const insertionTarget = afterSplitContentState.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(
    afterSplitContentState,
    insertionTarget,
    "atomic"
  );

  const charData = CharacterMetadata.create({ entity: entityKey });

  const fragmentArray = [
    new ContentBlock({
      key: genKey(),
      type: "atomic",
      text: character,
      characterList: List(Repeat(charData, character.length)),
      data: blockData,
    }),
    new ContentBlock({
      key: genKey(),
      type: "unstyled",
      text: "",
      characterList: List(),
    }),
  ];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment
  );

  const newContentState = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set("hasFocus", true),
  });

  return EditorState.push(editorState, newContentState, "insert-fragment");
};

export default insertAtomicBlockWithData;
