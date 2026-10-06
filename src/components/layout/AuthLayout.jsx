import { Users } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left branding panel — hidden on small screens */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary to-blue-700 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                        <Users className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">EmployeeHub</span>
                </div>

                <div className="max-w-md">
                    <h1 className="text-4xl font-bold leading-tight">
                        Manage your team, effortlessly.
                    </h1>
                    <p className="mt-4 text-white/80">
                        A modern dashboard for tracking employees, departments, and everything
                        in between all in one place.
                    </p>
                </div>

                <div className="text-sm text-white/70">
                    © {new Date().getFullYear()} EmployeeHub. All rights reserved.
                </div>

                {/* Decorative blurred circles */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            </div>

            {/* Right form panel */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Users className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">EmployeeHub</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}