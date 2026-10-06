import { Inbox } from "lucide-react";

export default function EmptyState({
    icon: Icon = Inbox,
    title = "Nothing here",
    description = "",
    action = null,
    className = "",
}) {
    return (
        <div className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}