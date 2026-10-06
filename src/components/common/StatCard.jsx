export default function StatCard({ label, value, icon: Icon, trend, color = "primary" }) {
    const colorMap = {
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        danger: "bg-danger/10 text-danger",
        muted: "bg-muted text-muted-foreground",
    };

    return (
        <div className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
                    {trend && (
                        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
                    )}
                </div>
                {Icon && (
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}