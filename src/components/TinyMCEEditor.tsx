"use client";

import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/table";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";

export default function TinyMCEEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  return <Editor
    licenseKey="gpl"
    value={value}
    onEditorChange={onChange}
    init={{
      height: 520,
      menubar: "edit view insert format tools table",
      plugins: "advlist autolink lists link table searchreplace wordcount",
      toolbar: "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | table link | removeformat",
      content_style: "body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding: 12px; }",
      branding: false,
      promotion: false,
      skin: false,
      content_css: false,
    }}
  />;
}
