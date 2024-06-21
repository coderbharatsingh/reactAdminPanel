import * as React from 'react';

interface ClassParams {
    key: string;
    active: boolean;
    label: string;
    onToggle: (style: any) => void;
    style: string;
}
export const StyleButton: React.FC<ClassParams> = ({style, onToggle, active, label}) => {
    const onMouseDown = (e) => {
      e.preventDefault();
      onToggle(style);
    };

    let className = 'RichEditor-styleButton';
    if (active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={onMouseDown}>
        {label}
      </span>
    );
}
