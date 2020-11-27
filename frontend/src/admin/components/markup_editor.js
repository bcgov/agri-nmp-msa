import { Editor } from '@tinymce/tinymce-react';
import React from 'react';

const MarkupEditor = (props) => {
  const { markup, onChange } = props;

  return (
    <div>
      <Editor
        value={markup}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: false,
          plugins: 'autolink link preview hr insertdatetime table paste lists',
          toolbar: 'undo redo | styleselect |  bold italic underline | forecolor backcolor | removeformat | bullist numlist',
        }}
      />
    </div>
  );
};

export default MarkupEditor;
