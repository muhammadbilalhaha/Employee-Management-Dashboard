import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  selectAllEmployees,
  selectDashboardStats,
  selectDepartmentCounts,
} from "../features/employees/employeesSelectors";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card";
import Skeleton from "../components/common/Skeleton";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";

// Format salary as PKR
function formatSalary(n) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Dashboard() {
  const stats = useSelector(selectDashboardStats);
  const allEmployees = useSelector(selectAllEmployees);
  const departmentCounts = useSelector(selectDepartmentCounts);

  const loading = useSimulatedLoading(450);

if (loading) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          A snapshot of your organization at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-white shadow-sm"
          >
            <div className="border-b border-border px-5 py-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((__, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  // Recent = 5 most recently added (unshift puts new ones first)
  const recentEmployees = allEmployees.slice(0, 5);

  // Sort departments by count descending for the bar chart
  const sortedDepartments = Object.entries(departmentCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const maxCount = Math.max(...sortedDepartments.map(([, c]) => c), 1);

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          A snapshot of your organization at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={stats.total}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Active Employees"
          value={stats.active}
          icon={UserCheck}
          color="success"
          trend={
            stats.total > 0
              ? `${Math.round((stats.active / stats.total) * 100)}% of workforce`
              : undefined
          }
        />
        <StatCard
          label="Inactive Employees"
          value={stats.inactive}
          icon={UserX}
          color="danger"
        />
        <StatCard
          label="Departments"
          value={stats.departments}
          icon={Building2}
          color="muted"
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent employees */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
            <Link
              to="/employees"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentEmployees.length === 0 ? (
              <EmptyState
                title="No employees yet"
                description="Add your first employee to see them here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentEmployees.map((emp) => (
                  <li key={emp.id}>
                    <Link
                      to={`/employees/${emp.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {emp.firstName.charAt(0)}
                        {emp.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {emp.role} · {emp.department}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <Badge
                          variant={emp.status === "Active" ? "success" : "danger"}
                        >
                          {emp.status}
                        </Badge>
                      </div>
                      <p className="hidden text-xs font-medium text-muted-foreground sm:block">
                        {formatSalary(emp.salary)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Department distribution */}
        <Card>
          <CardHeader>
            <CardTitle>By Department</CardTitle>
            <span className="text-xs text-muted-foreground">
              {stats.departments} total
            </span>
          </CardHeader>
          <CardContent>
            {sortedDepartments.length === 0 ? (
              <EmptyState
                title="No departments"
                description="Department breakdown will appear once employees exist."
              />
            ) : (
              <ul className="space-y-4">
                {sortedDepartments.map(([name, count]) => {
                  const pct = (count / maxCount) * 100;
                  const share =
                    stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <li key={name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{name}</span>
                        <span className="text-muted-foreground">
                          {count} · {share}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}