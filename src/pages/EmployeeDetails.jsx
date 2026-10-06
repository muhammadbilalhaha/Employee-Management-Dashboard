import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase,
    Calendar,
    Wallet,
    Pencil,
    Trash2,
    UserX,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { selectEmployeeById } from "../features/employees/employeesSelectors";
import { deleteEmployee } from "../features/employees/employeesSlice";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmployeeForm from "../components/employees/EmployeeForm";

function formatSalary(n) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(n);
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

export default function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Memoize selector so it rebuilds when id changes
    const selector = selectEmployeeById(id);
    const employee = useSelector(selector);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    if (!employee) {
        return (
            <div className="space-y-6">
                <Link
                    to="/employees"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to employees
                </Link>
                <Card>
                    <EmptyState
                        icon={UserX}
                        title="Employee not found"
                        description={`No employee exists with ID "${id}". It may have been deleted.`}
                        action={
                            <Button onClick={() => navigate("/employees")}>
                                Go to employees
                            </Button>
                        }
                    />
                </Card>
            </div>
        );
    }

    const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();

    const confirmDelete = () => {
        setDeleting(true);
        setTimeout(() => {
            dispatch(deleteEmployee(employee.id));
            setDeleting(false);
            setDeleteOpen(false);
            navigate("/employees", { replace: true });
        }, 350);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    to="/employees"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to employees
                </Link>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Profile card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                            {initials}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {employee.role} · {employee.department}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <Badge
                                    variant={employee.status === "Active" ? "success" : "danger"}
                                >
                                    {employee.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    ID: {employee.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y divide-border p-0 px-5">
                        <DetailRow icon={Mail} label="Email" value={employee.email} />
                        <DetailRow icon={Phone} label="Phone" value={employee.phone} />
                        <DetailRow icon={MapPin} label="Location" value={employee.location} />
                    </CardContent>
                </Card>

                {/* Employment Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y divide-border p-0 px-5">
                        <DetailRow icon={Building2} label="Department" value={employee.department} />
                        <DetailRow icon={Briefcase} label="Role" value={employee.role} />
                        <DetailRow
                            icon={Calendar}
                            label="Joining Date"
                            value={formatDate(employee.joiningDate)}
                        />
                        <DetailRow
                            icon={Wallet}
                            label="Salary"
                            value={formatSalary(employee.salary)}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Edit modal */}
            <EmployeeForm
                open={editOpen}
                onClose={() => setEditOpen(false)}
                employee={employee}
            />

            {/* Delete confirmation */}
            <ConfirmDialog
                open={deleteOpen}
                title="Delete employee?"
                description={`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />
        </div>
    );
}