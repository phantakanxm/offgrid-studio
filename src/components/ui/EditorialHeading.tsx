import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizeClass = {
  xxl: "text-display-xxl",
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
} as const;

interface EditorialHeadingProps {
  as?: "h1" | "h2" | "h3" | "p";
  size: keyof typeof sizeClass;
  /** Each entry renders on its own line; preferred over children for multi-line display type. */
  lines?: readonly ReactNode[];
  /** Wraps each word of string lines in [data-word] for word-level motion. */
  splitWords?: boolean;
  /** Rendered after the lines, e.g. a motion behaviour that animates this heading. */
  children?: ReactNode;
  id?: string;
  className?: string;
  /** Hooks for motion behaviours, e.g. data-intro. */
  [dataAttribute: `data-${string}`]: string | undefined;
}

// Lines and words are split on the server, so motion code animates real markup instead of
// rewriting React-owned DOM in the browser. [data-line-mask] becomes a clip during reveals.
function renderLine(line: ReactNode, splitWords: boolean) {
  if (!splitWords || typeof line !== "string") return line;
  return line.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span data-word="" className="inline-block">
        {word}
      </span>
    </Fragment>
  ));
}

export function EditorialHeading({
  as: Tag = "h2",
  size,
  lines,
  splitWords = false,
  children,
  id,
  className,
  ...dataAttributes
}: EditorialHeadingProps) {
  return (
    <Tag id={id} className={cn(sizeClass[size], className)} {...dataAttributes}>
      {lines?.map((line, index) => (
        // The space keeps words apart for screen readers and copy/paste; block display hides it visually.
        <Fragment key={index}>
          {index > 0 && " "}
          <span data-line-mask="" className="block">
            <span data-line="" className="block">
              {renderLine(line, splitWords)}
            </span>
          </span>
        </Fragment>
      ))}
      {children}
    </Tag>
  );
}
