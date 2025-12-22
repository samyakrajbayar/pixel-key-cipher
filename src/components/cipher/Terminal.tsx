import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Terminal({ title = "output", children, className }: TerminalProps) {
  return (
    <div className={cn("rounded-lg border border-border/50 bg-muted/30 overflow-hidden", className)}>
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-secondary/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-accent/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          {title}
        </span>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
}

interface TerminalLineProps {
  prefix?: string;
  children: ReactNode;
  variant?: "default" | "success" | "error" | "info";
}

export function TerminalLine({ prefix = "$", children, variant = "default" }: TerminalLineProps) {
  const variantStyles = {
    default: "text-foreground",
    success: "text-accent",
    error: "text-destructive",
    info: "text-primary",
  };

  return (
    <div className="flex gap-2 items-start">
      <span className="text-primary shrink-0">{prefix}</span>
      <span className={cn(variantStyles[variant], "break-all")}>{children}</span>
    </div>
  );
}
