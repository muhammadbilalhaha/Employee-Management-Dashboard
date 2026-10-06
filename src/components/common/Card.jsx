export function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`rounded-lg border border-border bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-between border-b border-border px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-semibold tracking-tight ${className}`}>{children}</h3>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}