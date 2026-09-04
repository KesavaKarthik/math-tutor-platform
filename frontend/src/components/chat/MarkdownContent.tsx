import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Hoisted so the plugin arrays keep a stable identity across renders.
const REMARK_PLUGINS = [remarkMath];
const REHYPE_PLUGINS = [rehypeKatex];

/** Single entry point for rendering tutor/textbook markdown with LaTeX support. */
export default function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
      {children}
    </ReactMarkdown>
  );
}
