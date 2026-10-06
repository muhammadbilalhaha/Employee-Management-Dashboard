import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { login, clearAuthError, DEMO_CREDENTIALS } from "../features/auth/authSlice";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    // Already logged in? Redirect away
    useEffect(() => {
        if (isAuthenticated) navigate(from, { replace: true });
    }, [isAuthenticated, from, navigate]);

    // Clear redux error when the user starts typing
    useEffect(() => {
        if (error) dispatch(clearAuthError());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.email, form.password]);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = "Please enter a valid email";

        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6)
            errs.password = "Password must be at least 6 characters";

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        // Simulate a brief network delay so the loading state is visible
        setTimeout(() => {
            dispatch(login(form));
            setSubmitting(false);
        }, 400);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
        }
    };

    const fillDemo = () => {
        setForm({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
        });
        setFieldErrors({});
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue."
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                    <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    autoComplete="email"
                    autoFocus
                />

                <div className="relative">
                    <Input
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        error={fieldErrors.password}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>

                <Button type="submit" className="w-full" loading={submitting} size="lg">
                    {submitting ? "Signing in..." : "Sign in"}
                </Button>

                {/* Demo credentials helper */}
                <div className="rounded-md border border-dashed border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="font-medium text-foreground">Demo credentials</p>
                            <p className="mt-0.5">
                                {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemo}
                            className="rounded border border-border bg-white px-2 py-1 text-xs font-medium hover:bg-muted"
                        >
                            Fill
                        </button>
                    </div>
                </div>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Create one
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}