import Quill from 'quill';
import 'quill/dist/quill.core.css';
import React, { useEffect, useRef } from 'react';

function TextEditor(): JSX.Element {
  const quillRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.innerHTML = '';
      const editor = document.createElement('div');
      quillRef.current.append(editor);
      new Quill(editor, {
        placeholder: 'Compose an epic...',
        theme: 'snow',
      });
    }
    return () => {
      if (quillRef.current) {
        quillRef.current.innerHTML = '';
      }
    };
  }, []);
  return (
    <div className="max-h-full w-full flex flex-col" ref={quillRef}>
      Text Editor
    </div>
  );
}

export default React.memo(TextEditor);
