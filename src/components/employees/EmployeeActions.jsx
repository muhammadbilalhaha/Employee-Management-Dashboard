import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

export default function EmployeeActions({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handle = (fn) => (e) => {
    e.stopPropagation();
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-md border border-border bg-white shadow-lg">
          <button
            onClick={handle(onView)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button
            onClick={handle(onEdit)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handle(onDelete)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}