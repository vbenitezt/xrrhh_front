import { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FloatButton, message } from 'antd';
import { toast } from 'react-hot-toast';
import { FaMicrophoneAlt } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import { toolbarOps } from './text.editor.base';
import { v4 } from 'uuid';

function SolarUserSpeakBroken(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" stroke="#000000" strokeWidth="1.5">
        <circle cx="10" cy="6" r="4"></circle>
        <path
          strokeLinecap="round"
          d="M19 2s2 1.2 2 4s-2 4-2 4m-2-6s1 .6 1 2s-1 2-1 2m.997 10c.003-.164.003-.331.003-.5c0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S2 22 10 22c2.231 0 3.84-.157 5-.437"
        ></path>
      </g>
    </svg>
  );
}

const TextEditor = ({ 
  content, 
  setContent, 
  readOnly=false, 
  preSave=()=>{}, 
  showToolBar=true, 
  placeholder='Escriba aquí...',
  reactQuillRef=useRef(null),
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { 
    listening, 
    transcript, 
    resetTranscript, 
    browserSupportsSpeechRecognition, 
    isMicrophoneAvailable, 
    finalTranscript 
} = useSpeechRecognition();

  useEffect(() => {
    attachQuillRefs();
  }, []);

  useEffect(() => {
    if (finalTranscript) {
      console.log('Cambiando Texto', finalTranscript);
      insertText(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (transcript && !finalTranscript) {
      messageApi.open({
        key: 'transcript',
        type: 'info',
        content: (
          <span className="flex flex-row items-center gap-1">
            <SolarUserSpeakBroken /> {transcript}
          </span>
        ),
        icon: <></>,
      });
    }
  }, [transcript]);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.current.getEditor !== 'function') return;
    const keyboard = reactQuillRef.current.editor.getModule("keyboard");
    keyboard.addBinding({
        key: "B", 
        ctrlKey: true,
        handler: (range, context) => {
            listening ? stopRecording: startRecording();
          }
    });
    keyboard.addBinding({ 
        key: "P", 
        ctrlKey: true,
        handler: (range, context) => {
            stopRecording();
          }
    });
    keyboard.addBinding({ 
        key: "S", 
        ctrlKey: true,
        handler: (range, context) => {
            preSave();
          }
    });
  };

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'es-CL' });
  }
  
  const stopRecording = () => {
    SpeechRecognition.stopListening();
        resetTranscript();
  }
  

  const insertText = (text) => {
    const range = reactQuillRef.current.editor.getSelection();
    const position = range ? range.index : 0;
    reactQuillRef.current.editor.insertText(position, text);
    reactQuillRef.current.editor.setSelection(position + text.length);
  };

  if (!browserSupportsSpeechRecognition) {
    toast.error('Este navegador no soporta su reconocimiento de voz');
  }

  if (!isMicrophoneAvailable) {
    toast.error('Tu micrófono no está activado');
  }

  return (
    <>
      {contextHolder}
        { listening && 
            <FloatButton
                className='animate-bounce'
                // type="primary"
                icon={<FaMicrophoneAlt color="red"/>}
                onClick={() => {
                stopRecording();
                }}
            />
        }
      <ReactQuill
        id={v4()}
        className="flex flex-col w-full h-full overflow-y-auto"
        modules={{ 
            toolbar: showToolBar && toolbarOps,
         }}
        theme="snow"
        placeholder={placeholder}
        readOnly={readOnly}
        ref={reactQuillRef}
        value={content}
        onChange={setContent}
      />
    </>
  );
};

export default TextEditor;
