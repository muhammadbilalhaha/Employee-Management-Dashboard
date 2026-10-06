export default function Button({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    className = "",
    disabled = false,
    loading = false,
    onClick,
    ...rest
}) {
    const base =
        "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary",
        danger: "bg-danger text-danger-foreground hover:opacity-90 focus:ring-danger",
        outline:
            "border border-border bg-white text-foreground hover:bg-muted focus:ring-primary",
        ghost: "text-foreground hover:bg-muted focus:ring-primary",
        success: "bg-success text-success-foreground hover:opacity-90 focus:ring-success",
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...rest}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
        </button>
    );
}