export default function Input({
    label,
    error,
    type = "text",
    className = "",
    id,
    ...rest
}) {
    const inputId = id || rest.name;
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1.5 block text-sm font-medium text-foreground"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={`h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
                    } ${className}`}
                {...rest}
            />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
}