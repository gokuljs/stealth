import 'quill/dist/quill.core.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.css';
import { Socket, io } from 'socket.io-client';

function TextEditor(): JSX.Element {
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    const s = io('http://localhost:4000');
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const handleEditorChange = (content, delta, source, editor): void => {
    if (source !== 'user' || socket === null) return;
    setValue(content);
    socket.emit('send-changes', delta);
  };

  useEffect(() => {
    if (socket === null || !quillRef.current) return;
    const quill = quillRef.current.getEditor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (delta: any): void => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);
    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket]);

  return <ReactQuill ref={quillRef} theme="snow" value={value} onChange={handleEditorChange} />;
}

export default React.memo(TextEditor);
