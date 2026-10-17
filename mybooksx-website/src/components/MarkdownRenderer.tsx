import React from 'react';
import { Copy, Check } from 'lucide-react';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Basic markdown parser without heavy external libraries
  const renderFormatted = () => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'code';
        const codeText = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="code-block-container">
            <div className="code-block-header">
              <span className="code-lang-label">{language}</span>
              <button
                type="button"
                className="code-copy-btn"
                onClick={() => handleCopy(codeText, index)}
              >
                {copiedIndex === index ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                <span>{copiedIndex === index ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="code-content">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Handle standard text lines
      const paragraphs = part.split(/\n\n+/);
      return (
        <div key={index} className="markdown-prose">
          {paragraphs.map((para, pIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            // Bullet list
            if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').filter(Boolean);
              return (
                <ul key={pIdx} className="markdown-list">
                  {items.map((item, iIdx) => (
                    <li key={iIdx}>
                      {parseInlineStyles(item.replace(/^[-*•]\s+/, ''))}
                    </li>
                  ))}
                </ul>
              );
            }

            // Headings
            if (trimmed.startsWith('### ')) {
              return <h4 key={pIdx}>{parseInlineStyles(trimmed.slice(4))}</h4>;
            }
            if (trimmed.startsWith('## ')) {
              return <h3 key={pIdx}>{parseInlineStyles(trimmed.slice(3))}</h3>;
            }
            if (trimmed.startsWith('# ')) {
              return <h2 key={pIdx}>{parseInlineStyles(trimmed.slice(2))}</h2>;
            }

            return <p key={pIdx}>{parseInlineStyles(trimmed)}</p>;
          })}
        </div>
      );
    });
  };

  const parseInlineStyles = (text: string) => {
    // Bold **text**
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((b, bi) => {
      if (b.startsWith('**') && b.endsWith('**')) {
        return <strong key={bi}>{b.slice(2, -2)}</strong>;
      }
      // Inline `code`
      const codeParts = b.split(/(`.*?`)/g);
      return codeParts.map((c, ci) => {
        if (c.startsWith('`') && c.endsWith('`')) {
          return <code key={ci} className="inline-code">{c.slice(1, -1)}</code>;
        }
        return c;
      });
    });
  };

  return <div className="rendered-markdown-root">{renderFormatted()}</div>;
};
