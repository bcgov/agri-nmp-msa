import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useState } from 'react';

const MarkupEditor = (props) => {
  const { markup, onSave } = props;

  const [content, setContent] = useState(markup);

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log(e);
        onSave(content);
      }}>
        <Editor
          value={content}
          onEditorChange={setContent}
          init={{
            height: 400,
            menubar: false,
            plugins: 'autolink link preview hr insertdatetime table paste',
            toolbar: 'undo redo  | bold italic underline | removeformat |s bullist numlist',
          }}
        />
        <button type="submit" className="btn">Save</button>
      </form>
    </div>
  );
};

export default MarkupEditor;
