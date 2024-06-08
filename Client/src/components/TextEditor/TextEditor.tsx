import 'quill/dist/quill.core.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.css';
import { Socket, io } from 'socket.io-client';
import { EmitterSource } from 'quill';
import { Delta } from 'quill/core';

const URL = 'http://localhost:4000';

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: '1' }, { header: '2' }, { header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ align: [] }],
    ['link', 'image', 'video', 'formula'], // add formula option
    ['clean'], // remove formatting button
  ],
};

interface TextEditorProps {
  docId: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ docId }) => {
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [enable, setEnable] = useState(false);

  // establishing socket connection
  useEffect(() => {
    const s = io(URL);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current || socket === null) return;
    const quill = quillRef.current.getEditor();
    const handler = (delta: Delta): void => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler); // receiving the changes from all other chat rooms
    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket]);

  useEffect(() => {
    if (!quillRef.current || socket === null) return;
    const quill = quillRef.current.getEditor();
    socket.once('load-document', (document) => {
      quill.setContents(document);
      setEnable(true);
    });
    socket.emit('get-document', docId);
  }, [socket, docId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  // onchange send the update all other chats
  const handleEditorChange = (content: string, delta: Delta, source: EmitterSource): void => {
    if (source !== 'user' || socket === null) return;
    setValue(content);
    socket.emit('send-changes', delta);
  };

  return (
    <ReactQuill
      readOnly={!enable}
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={handleEditorChange}
      placeholder="Enter your text here"
      modules={modules}
    />
  );
};

export default React.memo(TextEditor);
