import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

function CodeEditor() {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        const doc = new Y.Doc(); // collection of shared objects -> Text

        // Connect to peers (or start connection) with WebRTC
        const provider = new WebrtcProvider("test-room", doc); // room1, room2

        const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }

        const binding = new MonacoBinding(
            type,
            editorRef.current.getModel(),
            new Set([editorRef.current]),
            provider.awareness
        );
        console.log(provider.awareness);
    }

    return (
        <div className="h-full w-full m-5">
            <Editor
                height="100%"
                width="100%%"
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />
            ;
        </div>
    );
}

export default CodeEditor;
