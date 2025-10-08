/**
 * CodeDisplay - Syntax-Highlighted Code Renderer
 *
 * Displays agent-generated code with beautiful syntax highlighting.
 * Supports TypeScript, JavaScript, Python, and more.
 */

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./CodeDisplay.css";

interface CodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language = "javascript",
  title,
}) => {
  return (
    <div className="code-display">
      {title && <div className="code-display-header">{title}</div>}
      <div className="code-display-content">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.9rem",
            borderRadius: "0.5rem",
            background: "#1e1e1e",
          }}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "#858585",
            userSelect: "none",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
