import React from 'react';
import EmailEditor from 'react-email-editor';
import { useThemeStore } from '../../common/store/themeStore';
import { v4 } from 'uuid';

const EmailsEditor = ({ emailEditorRef, onLoad, initialHtml }) => {

    const { theme } = useThemeStore();

    const onReady = () => {
        // editor is ready
        console.log('onReady');
        onLoad();
    };

    return (
        <EmailEditor
            ref={emailEditorRef}
            onLoad={onLoad}
            onReady={onReady}
            editorId={v4()}
            initialHtml={initialHtml}
            options={{
                locale: "es-CL",
                appearance: {
                    theme: `modern_${theme}`,
                    panels: {
                        tools: {
                            dock: 'right'
                        }
                    }
                }
            }}
        />
    );
};

export default EmailsEditor;