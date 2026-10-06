import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Download,
  RefreshCw,
  Info,
  AlertTriangle,
  Shield,
  HardDrive,
  Cpu,
  Bell,
  Mail,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { generateEmployees } from "../data/employees";
import {
  setRecipient,
  clearLastSent,
  POSITIONS,
} from "../features/notifications/notificationsSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const employees = useSelector((state) => state.employees.employees);
  const recipient = useSelector((state) => state.notifications.recipient);
  const lastSent = useSelector((state) => state.notifications.lastSent);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // ----- Notification recipient form state -----
  const [recipientForm, setRecipientForm] = useState({
    email: recipient.email || "",
    position: recipient.position || "CEO",
    customTitle: recipient.customTitle || "",
  });
  const [recipientErrors, setRecipientErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  // Keep form in sync if recipient changes externally (e.g. after reset)
  useEffect(() => {
    setRecipientForm({
      email: recipient.email || "",
      position: recipient.position || "CEO",
      customTitle: recipient.customTitle || "",
    });
  }, [recipient.email, recipient.position, recipient.customTitle]);

  const handleRecipientChange = (e) => {
    const { name, value } = e.target;
    setRecipientForm((prev) => ({ ...prev, [name]: value }));
    if (recipientErrors[name]) {
      setRecipientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRecipientSave = () => {
    const errs = {};

    if (!recipientForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientForm.email))
      errs.email = "Please enter a valid email";

    if (
      recipientForm.position === "Custom" &&
      !recipientForm.customTitle.trim()
    )
      errs.customTitle = "Custom title is required";

    setRecipientErrors(errs);
    if (Object.keys(errs).length > 0) return;

    dispatch(
      setRecipient({
        email: recipientForm.email.trim().toLowerCase(),
        position: recipientForm.position,
        customTitle:
          recipientForm.position === "Custom"
            ? recipientForm.customTitle.trim()
            : "",
        enabled: true,
      })
    );

    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  // ----- Existing handlers -----
  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      totalEmployees: employees.length,
      employees,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setResetting(true);
    setTimeout(() => {
      localStorage.removeItem("ems_employees");
      const fresh = generateEmployees(42);
      localStorage.setItem("ems_employees", JSON.stringify(fresh));
      setResetting(false);
      setResetOpen(false);
      window.location.reload();
    }, 400);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your account details, data integrations, and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Profile */}
        <div className="space-y-8 lg:col-span-5">
          <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Account Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-2xl font-bold text-primary-foreground shadow-sm ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-sm font-medium text-muted-foreground">
                    {user?.email || "No email provided"}
                  </p>
                </div>
              </div>

              {/* Role Badge Box */}
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Access Role
                  </span>
                </div>
                <Badge
                  variant="primary"
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                >
                  {user?.role || "Employee"}
                </Badge>
              </div>

              {/* Disclaimer Note */}
              <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong className="font-medium text-foreground">Note:</strong>{" "}
                  Profile editing is disabled in this demo environment. In a
                  production build, changes made here would sync securely via{" "}
                  <code>/api/users/me</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notifications + Data + Info */}
        <div className="space-y-8 lg:col-span-7">
          {/* Notification Recipients Card */}
          <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" />
                Notification Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-xs leading-relaxed text-muted-foreground">
                When a new employee is created, an email notification will
                automatically be sent to the address below.
              </p>

              {/* Position */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Position
                </label>
                <select
                  name="position"
                  value={recipientForm.position}
                  onChange={handleRecipientChange}
                  className="h-10 w-full cursor-pointer rounded-md border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom title (conditional) */}
              {recipientForm.position === "Custom" && (
                <Input
                  label="Custom title"
                  name="customTitle"
                  value={recipientForm.customTitle}
                  onChange={handleRecipientChange}
                  error={recipientErrors.customTitle}
                  placeholder="e.g. Team Lead, Operations Head"
                />
              )}

              {/* Email */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={recipientForm.email}
                onChange={handleRecipientChange}
                error={recipientErrors.email}
                placeholder="ceo@company.com"
              />

              {/* Save button */}
              <div className="flex items-center gap-3">
                <Button onClick={handleRecipientSave} size="sm">
                  <Mail className="h-4 w-4" />
                  Save Recipient
                </Button>

                {savedFlash && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>

              {/* Current recipient preview */}
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Recipient
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {recipient.position === "Custom"
                        ? recipient.customTitle || "Custom"
                        : recipient.position}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {recipient.email || "Not set"}
                    </p>
                  </div>
                  <Badge variant={recipient.enabled ? "success" : "muted"}>
                    {recipient.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Last sent preview */}
              {lastSent && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Last Notification
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-foreground">
                        {lastSent.subject}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        Sent to {lastSent.to} ·{" "}
                        {new Date(lastSent.sentAt).toLocaleString("en-GB")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(clearLastSent())}
                      className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Management Card */}
          <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardDrive className="h-5 w-5 text-primary" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Export Block */}
              <div className="group flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/20">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Export employee records
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Download a JSON backup of all {employees.length} employees.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="w-full shrink-0 sm:w-auto"
                >
                  Download JSON
                </Button>
              </div>

              {/* Reset Block */}
              <div className="group flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/20">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Restore demo data
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Regenerate the original 42-employee starter dataset.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetOpen(true)}
                  className="w-full shrink-0 sm:w-auto"
                >
                  Reset Data
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="flex items-start gap-4 rounded-xl border border-danger/20 bg-danger/5 p-5">
                <div className="rounded-full bg-danger/10 p-2.5 text-danger">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-danger">
                    Local Storage Warning
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-danger/80">
                    All application state and modifications are persisted
                    locally in your browser. Clearing your browser cache will
                    erase your changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Info Card */}
          <Card className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5 text-primary" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    Employee Management Dashboard
                  </p>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">
                    A frontend-only React architecture utilizing Redux Toolkit
                    for state management, React Router for navigation, and
                    Tailwind CSS v4 for utility-first styling.
                  </p>
                </div>
              </div>

              {/* Tech Stack Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Version", value: "1.0.0" },
                  { label: "React", value: "18.0+" },
                  { label: "Redux", value: "Toolkit 2.x" },
                  { label: "Styling", value: "Tailwind v4" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col space-y-1.5 rounded-lg border border-border/50 bg-muted/10 p-3"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetOpen}
        title="Restore Demo Data?"
        description="This action will permanently replace all current employee records with a fresh set of 42 dummy profiles. Any custom changes will be lost."
        confirmLabel="Yes, reset data"
        variant="danger"
        loading={resetting}
        onConfirm={handleResetData}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}