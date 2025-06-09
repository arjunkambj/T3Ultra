import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import { Divider } from "@heroui/divider";
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
      <div className="bg-default-50 rounded-lg border border-default-200 my-3 group relative overflow-hidden">
        <div className="absolute top-2 right-2 z-10">
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
      <ol className="list-decimal ml-5 my-2 space-y-1" {...props}>
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
      <ul className="list-disc ml-5 my-2 space-y-1" {...props}>
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
        className="text-primary hover:text-primary-600 underline transition-colors"
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
        <p className="leading-relaxed mb-3" {...props}>
          {children}
        </p>
      </div>
    );
  },

  //BLOCKQUOTES (> quoted text)
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote
        className="border-l-4 border-primary bg-default-50 pl-4 py-2 my-3 italic"
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
        className="bg-default-100 text-amber-300 px-1.5 py-0.5 rounded text-sm font-mono"
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
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
