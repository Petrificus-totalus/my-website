import { useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";

const useMarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const mdParser = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str, true).value;
        } catch (__) {}
      }
      return ""; // 使用自定义的样式
    },
  });

  const handleEditorChange = ({ html, text }) => {
    setMarkdown(text);
  };

  return { markdown, setMarkdown, mdParser, handleEditorChange };
};

export default useMarkdownEditor;
