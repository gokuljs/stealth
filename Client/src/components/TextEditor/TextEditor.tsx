import 'quill/dist/quill.core.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles.css';
import { Socket, io } from 'socket.io-client';
import { EmitterSource } from 'quill';
import { Delta } from 'quill/core';
import { useParams } from 'react-router-dom';
import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';
import useUserLoggedInDetails from '@/hooks/useUserLoggedInDetails';
import { Permission } from '@/apis/document';
import { env } from '@/lib/environment';

const URL = env.VITE_API_BASE_URL || 'http://localhost:4000';

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

const TextEditor: React.FC<TextEditorProps> = () => {
  const { docId } = useParams();
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data } = useCurrentActiveDocument();
  const { userEmail } = useUserLoggedInDetails();
  const role = data?.collaborators?.find((item) => item.email === userEmail)?.permission;
  if (!docId) return;

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

  useEffect(() => {
    if (!quillRef.current || socket === null) return;

    const quill = quillRef.current.getEditor();

    const debounceSave = (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        socket.emit('save-document', quill.getContents());
      }, 1000); // Adjust the delay (in milliseconds) as needed
    };

    debounceSave();
    // Clean up the timeout if the component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [socket, value]);

  return (
    <ReactQuill
      key={docId}
      readOnly={role === Permission.READONLY}
      ref={quillRef}
      theme="snow"
      onChange={handleEditorChange}
      placeholder={role === Permission.READONLY ? 'You cannot edit the text as you only have read-only permission.' : 'Enter your text here '}
      modules={modules}
    />
  );
};

export default React.memo(TextEditor);
