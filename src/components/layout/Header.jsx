import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

export default function Header({ pageTitle, onOpenSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-white/95 px-4 backdrop-blur lg:px-6">
            {/* Left: mobile menu + title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
            </div>

            {/* Right: user dropdown */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-md border border-border bg-white px-2 py-1.5 text-sm hover:bg-muted"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden font-medium sm:inline">{user?.name || "User"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-border bg-white shadow-lg">
                        <div className="border-b border-border px-3 py-2.5">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                navigate("/settings");
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}