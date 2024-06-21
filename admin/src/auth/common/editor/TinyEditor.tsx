import * as React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { EduleteApi } from 'api';

interface EditorParams {
    defaultValue?: string;
    placeholder?: string;
    onChange?: (e: any) => void;
}

declare type ProgressFn = (percent: number) => void;
interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
}

export const TinyEditor: React.FC<EditorParams> = ({ defaultValue = '', onChange, placeholder = '' }) => {
    const useDarkMode = false;

    const imageUploadHandler = async (blobInfo: BlobInfo, progress: ProgressFn): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            const blob = blobInfo.blob();
            const name = blob?.['name'] || blobInfo.filename();
            const type = blob.type;
            const size = blob.size;
            const value = `data:${type};base64,${blobInfo.base64()}`;
            const results = await EduleteApi.getResult(await EduleteApi.uploadFileFromEditor({ name, type, size, value }));
            
            if(results && results['success'] && results['location']) {
                resolve(`${process.env.REACT_APP_UPLOAD_PATH}${results['location']}`);
            } else {
                reject("File upload failed.");
            }
        });
    }

    const onChangeHandler = (content: string) => {
        if(onChange) {
            onChange(content);
        }      
    }
    
    return (<>
        <Editor
            onEditorChange={onChangeHandler}
            // onInit={(evt, editor) => editorRef.current = editor}
            textareaName="content"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            initialValue={defaultValue}
            init={{
                height: 300,
                theme_advanced_buttons3_add : "fullscreen",
                fullscreen_new_window : true,
                fullscreen_settings : {
                    theme_advanced_path_location : "top"
                },
                plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                imagetools_cors_hosts: ['picsum.photos'],
                menubar: 'file edit view insert format tools table help',
                toolbar: 'undo redo | bold italic underline strikethrough | fullscreen | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | preview save print | insertfile image media template link anchor codesample | ltr rtl',
                toolbar_sticky: true,
                image_advtab: true,
                importcss_append: true,
                images_upload_handler: imageUploadHandler,
                // templates: [
                //     { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                // ],
                template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                image_caption: true,
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                noneditable_noneditable_class: 'mceNonEditable',
                toolbar_mode: 'sliding',
                contextmenu: 'link image imagetools table',
                skin: useDarkMode ? 'oxide-dark' : 'oxide',
                content_css: useDarkMode ? 'dark' : 'default',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    </>);
}
