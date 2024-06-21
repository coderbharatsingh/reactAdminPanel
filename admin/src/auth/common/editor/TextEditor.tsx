import * as React from 'react';
import { Editor, EditorState, RichUtils, convertFromHTML, ContentState, Modifier } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { InlineStyleControls } from './helper/InlineStyleControls';
import { BlockStyleControls } from './helper/BlockStyleControls';
import './editor.scss';

interface EditorParams {
  defaultValue: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}

export const TextEditor: React.FC<EditorParams> = ({ defaultValue, onChange, placeholder = '' }) => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const [editorClass, setEditorClass] = React.useState('');
  const editor = React.useRef<null | HTMLElement>(null);
  
  // Custom overrides for "code" style.
  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  const clickHandler = () => editor?.current?.focus();
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        setEditorState(newState);
      return true;
    }
    return false;
  }

  const onTab = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    if(blockType === "unordered-list-item" || blockType === "ordered-list-item"){
      changeHandler(RichUtils.onTab(e, editorState, 3));
    }else{
      let newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        '    '
      );
      
      changeHandler(EditorState.push(editorState, newContentState, 'insert-characters'))
    }
  }

  const changeHandler = (newEditorState) => {
    setEditorState(newEditorState);
    if(onChange) {
      const html = stateToHTML(newEditorState.getCurrentContent());
      onChange(html);
    }
  }

  const toggleBlockType = (blockType) => {
    setEditorState(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }
  
  React.useEffect(() => {
    const blocksFromHTML = convertFromHTML(defaultValue);
    const content = ContentState.createFromBlockArray(blocksFromHTML);
    setEditorState(EditorState.createWithContent(content));
  }, []);

  React.useEffect(() => {
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    setEditorClass(className);
  }, [editorState]);
  
  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyle}
      />
      <div className={editorClass} onClick={clickHandler}>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={changeHandler}
          onTab={onTab}
          placeholder={placeholder}
          ref={editor}
          spellCheck={true}
        />
      </div>
    </div>
  );
}
