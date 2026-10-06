import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import Badge from "../common/Badge";
import EmployeeActions from "./EmployeeActions";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

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
    month: "short",
    year: "numeric",
  });
}

function initials(emp) {
  return `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase();
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onResetFilters,
}) {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try changing your search or filters, or add a new employee."
        action={
          <Button variant="outline" onClick={onResetFilters}>
            Clear filters
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* Desktop table — scrolls inside a bounded container, header stays pinned */}
      <div className="hidden md:block">
        <div className="max-h-[54vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-muted/95 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Salary</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <td className="px-5 py-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initials(emp)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-1 text-sm">{emp.department}</td>
                  <td className="px-5 py-1 text-sm">{emp.role}</td>
                  <td className="px-5 py-1 text-sm text-muted-foreground">
                    {formatDate(emp.joiningDate)}
                  </td>
                  <td className="px-5 py-1 text-sm font-medium">
                    {formatSalary(emp.salary)}
                  </td>
                  <td className="px-5 py-1">
                    <Badge variant={emp.status === "Active" ? "success" : "danger"}>
                      {emp.status}
                    </Badge>
                  </td>
                  <td
                    className="px-5 py-1 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EmployeeActions
                      onView={() => navigate(`/employees/${emp.id}`)}
                      onEdit={() => onEdit(emp)}
                      onDelete={() => onDelete(emp)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list — also scrolls internally */}
      <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto md:hidden">
        {employees.map((emp) => (
          <li
            key={emp.id}
            className="cursor-pointer p-4 transition-colors hover:bg-muted/40"
            onClick={() => navigate(`/employees/${emp.id}`)}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials(emp)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {emp.role} · {emp.department}
                    </p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <EmployeeActions
                      onView={() => navigate(`/employees/${emp.id}`)}
                      onEdit={() => onEdit(emp)}
                      onDelete={() => onDelete(emp)}
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={emp.status === "Active" ? "success" : "danger"}>
                    {emp.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatSalary(emp.salary)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDate(emp.joiningDate)}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}