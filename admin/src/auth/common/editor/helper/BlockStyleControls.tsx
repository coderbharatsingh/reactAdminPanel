import * as React from 'react';
import { StyleButton } from './StyleButton';

interface ClassParams {
  onToggle: (blockType: string) => void;
  editorState: any;
}
export const BlockStyleControls: React.FC<ClassParams> = (props) => {
    const BLOCK_TYPES = [
      {label: 'H1', style: 'header-one'},
      {label: 'H2', style: 'header-two'},
      {label: 'H3', style: 'header-three'},
      {label: 'H4', style: 'header-four'},
      {label: 'H5', style: 'header-five'},
      {label: 'H6', style: 'header-six'},
      {label: 'Blockquote', style: 'blockquote'},
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'},
      {label: 'Code Block', style: 'code-block'},
    ];
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
  
    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };