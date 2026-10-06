import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    description = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="fixed overflow-clip inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={loading ? undefined : onCancel}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-lg border border-border bg-white shadow-xl">
                <div className="flex gap-4 p-5">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${variant === "danger" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
                            }`}
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold">{title}</h3>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}