import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default memo(function CustomNode({ data, type, isConnectable }: any) {
  const completed = data.completed;

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-xl bg-background/90 backdrop-blur-md border text-card-foreground transition-all duration-300 w-60",
        completed
          ? "border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-500/5 shadow-emerald-500/10"
          : "border-border hover:border-primary/50 hover:shadow-lg"
      )}
    >
      {/* Target Handle */}
      {type !== "input" && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground border-2 !border-background"
        />
      )}

      <div className="flex justify-between items-center gap-3">
        <div className="font-semibold text-sm leading-snug line-clamp-2">
          {data.label}
        </div>
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 animate-in zoom-in-50 duration-300" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground shrink-0 opacity-40" />
        )}
      </div>

      {/* Source Handle */}
      {type !== "output" && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-muted-foreground border-2 !border-background"
        />
      )}
    </div>
  );
});
