import React, { useEffect, useRef } from "react";
import { Placeholder } from "react-bootstrap";

export default function CKeditor({ onChange, editorLoaded, name, data, Placeholder, init }) {
    const editorRef = useRef();
    const { MyEditor, MyClassicEditor } = editorRef.current || {};

    useEffect(() => {
        // Sử dụng dynamic import để tránh lỗi
        if (!editorRef.current) {
            Promise.all([
                import('@ckeditor/ckeditor5-react'),
                import('@ckeditor/ckeditor5-build-classic')
            ]).then(([editorModule, classicEditorModule]) => {
                editorRef.current = {
                    MyEditor: editorModule.CKEditor,
                    MyClassicEditor: classicEditorModule.default
                };
                // Force re-render
                onChange(data);
            });
        }
    }, []);

    return (
        <>
            {editorLoaded && MyEditor ? (
                <MyEditor
                    initData={init}
                    config={Placeholder}
                    name={name}
                    editor={MyClassicEditor}
                    data={data}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        onChange(data);
                    }}
                />
            ) : (
                <div>Editor loading</div>
            )}
        </>
    )
}