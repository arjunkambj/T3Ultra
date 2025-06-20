import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";

import "@/styles/prism-vsc-dark-plus.css";
import { CodeClipboard } from "./code-clipboard";

const components: Partial<Components> = {
  //CODE BLOCKS (```code```)
  pre: ({ children, ...props }) => {
    const extractTextContent = (element: any): string => {
      if (typeof element === "string") {
        return element;
      }

      if (React.isValidElement(element) && element.props) {
        const props = element.props as any;

        if (props.children) {
          if (Array.isArray(props.children)) {
            return props.children.map(extractTextContent).join("");
          }

          return extractTextContent(props.children);
        }
      }

      if (Array.isArray(element)) {
        return element.map(extractTextContent).join("");
      }

      return String(element || "");
    };

    const codeString = extractTextContent(children);

    return (
      ///Code block
      <div className="group relative my-3 overflow-hidden rounded-lg border border-default-200 bg-default-50">
        <div className="absolute right-2 top-2 z-10">
          <CodeClipboard code={codeString} />
        </div>
        {/* Actual pre element with syntax highlighting */}
        <pre {...props}>{children}</pre>
      </div>
    );
  },

  //ORDERED LISTS (1. 2. 3.)
  ol: ({ children, ...props }) => {
    return (
      <ol className="my-2 ml-5 list-decimal space-y-1" {...props}>
        {children}
      </ol>
    );
  },

  //LIST ITEMS (within ul/ol)
  li: ({ children, ...props }) => {
    return (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    );
  },

  //UNORDERED LISTS (- or *)
  ul: ({ children, ...props }) => {
    return (
      <ul className="my-2 ml-5 list-disc space-y-1" {...props}>
        {children}
      </ul>
    );
  },

  //BOLD TEXT (**text** or *text*)
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },

  //LINKS ([text](url))
  a: ({ children, ...props }) => {
    return (
      // @ts-expect-error - Next.js Link props don't perfectly match anchor props
      <Link
        className="text-primary underline transition-colors hover:text-primary-600"
        rel="noreferrer" // Security: prevent referrer leakage
        target="_blank" // Open in new tab to preserve chat context
        {...props}
      >
        {children}
      </Link>
    );
  },

  //PARAGRAPHS // Text
  p: ({ children, ...props }) => {
    return (
      <div>
        <p className="mb-3 leading-relaxed" {...props}>
          {children}
        </p>
      </div>
    );
  },

  //BLOCKQUOTES (> quoted text)
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote
        className="my-3 border-l-4 border-primary bg-default-50 py-2 pl-4 italic"
        {...props}
      >
        {children}
      </blockquote>
    );
  },

  //INLINE CODE (`code`)
  code: ({ children, ...props }) => {
    return (
      <code
        className="rounded bg-default-100 px-1.5 py-0.5 font-mono text-sm text-amber-300"
        {...props}
      >
        {children}
      </code>
    );
  },
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      components={components} // Use our custom component mappings
      rehypePlugins={[rehypePrism]} // Add syntax highlighting to code blocks
      remarkPlugins={[remarkGfm]} // Add GitHub Flavored Markdown support (tables, strikethrough, etc.)
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
