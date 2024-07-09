import React from "react";
import { useState, useEffect } from "react";
import "./GptRes.css";
import logo from "../assets/logo.png";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Import a highlight.js style
import ClipboardJS from "clipboard";

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.listLanguages().includes(lang)) {
      try {
        const highlightedCode = hljs.highlight(str, { language: lang }).value;
        const escapedCode = md.utils.escapeHtml(str);
        // Generate the HTML for the code block with a copy button
        return (
          '<pre class="hljs"><code>' +
          highlightedCode +""+
          '</code><button class="copy-code-btn" data-clipboard-text="' +
           escapedCode
           +
          '">Copy</button></pre>'
        );
      } catch (__) {}
    }

    // Fallback if highlighting fails
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});


function GptRes({ text }) {
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-code-btn", {
      text: function (trigger) {
        return trigger.getAttribute("data-clipboard-text");
      },
    });

    clipboard.on("success", function (e) {
      e.trigger.textContent = "Copied ✔";
      setTimeout(() => {
        e.trigger.textContent = "Copy";
      }, 2000); 

      e.clearSelection();
    });

    return () => {
      clipboard.destroy();
    };
  }, []);
  const renderedText = md.render(text);

  // Initialize ClipboardJS
  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-code-btn");
    return () => {
      clipboard.destroy();
    };
  }, []);

  return (
    <div className="gpt_res_content">
      <img src={logo} alt="Logo" />
      <div className="text" dangerouslySetInnerHTML={{ __html: renderedText }} />
    </div>
  );
}

export default GptRes;
