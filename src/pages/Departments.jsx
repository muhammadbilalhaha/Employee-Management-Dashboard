import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Wallet, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  Layers
} from "lucide-react";
import {
  selectAllEmployees,
  selectDepartmentCounts,
} from "../features/employees/employeesSelectors";
import { DEPARTMENTS } from "../data/employees";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card";
import Badge from "../components/common/Badge";
import Skeleton from "../components/common/Skeleton";
import { useSimulatedLoading } from "../hooks/useSimulatedLoading";

function formatSalary(n) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Departments() {
  const allEmployees = useSelector(selectAllEmployees);
  const counts = useSelector(selectDepartmentCounts);
  const loading = useSimulatedLoading(400);

  // Build enriched list of every department (even those with 0 employees)
  const departments = DEPARTMENTS.map((name) => {
    const members = allEmployees.filter((e) => e.department === name);
    const activeCount = members.filter((e) => e.status === "Active").length;
    const totalSalary = members.reduce((sum, e) => sum + e.salary, 0);
    const avgSalary = members.length ? Math.round(totalSalary / members.length) : 0;
    const topMembers = [...members]
      .sort((a, b) => b.salary - a.salary)
      .slice(0, 3);

    return {
      name,
      count: counts[name] || 0,
      activeCount,
      avgSalary,
      topMembers,
    };
  }).sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div>
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-72 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-border/60 p-6 shadow-sm">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500 overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Department Insights
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Strategic breakdown of workforce deployment, compensation averages, and leadership.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-xs font-semibold bg-muted/30 border-border/60 rounded-full">
            <Layers className="h-3.5 w-3.5 text-primary" />
            {DEPARTMENTS.length} Active Departments
          </Badge>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const activePercentage = dept.count > 0 ? Math.round((dept.activeCount / dept.count) * 100) : 0;

          return (
            <Card
              key={dept.name}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="space-y-5">
                
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-xs">
                      <Building2 className="h-5.5 w-5.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
                        {dept.name}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {dept.count} {dept.count === 1 ? "Employee" : "Employees"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={dept.count > 0 ? "secondary" : "outline"}
                    className="shrink-0 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
                  >
                    {dept.count > 0 ? `${activePercentage}% Active` : "Empty"}
                  </Badge>
                </div>

                {/* Key Metrics Blocks */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 transition-colors group-hover:bg-muted/40">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary/70" />
                      Active Staff
                    </div>
                    <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
                      {dept.activeCount}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / {dept.count}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 transition-colors group-hover:bg-muted/40">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Wallet className="h-3.5 w-3.5 text-primary/70" />
                      Avg. Salary
                    </div>
                    <p className="mt-1 truncate text-sm font-bold tracking-tight text-foreground">
                      {dept.avgSalary ? formatSalary(dept.avgSalary) : "—"}
                    </p>
                  </div>
                </div>

                {/* Top Earners List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Top Compensation
                    </span>
                    <TrendingUp className="h-3 w-3 text-muted-foreground/50" />
                  </div>

                  {dept.topMembers.length > 0 ? (
                    <div className="space-y-1">
                      {dept.topMembers.map((emp) => (
                        <Link
                          key={emp.id}
                          to={`/employees/${emp.id}`}
                          className="group/item flex items-center justify-between gap-2 rounded-lg p-2 transition-all hover:bg-muted/60"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-2 ring-background shadow-2xs">
                              {emp.firstName.charAt(0)}
                              {emp.lastName.charAt(0)}
                            </div>
                            <span className="truncate text-xs font-medium text-foreground transition-colors group-hover/item:text-primary">
                              {emp.firstName} {emp.lastName}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-muted-foreground group-hover/item:text-foreground">
                            {formatSalary(emp.salary)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-border/70 p-4">
                      <p className="text-xs text-muted-foreground">
                        No team members registered yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 border-t border-border/40 pt-4">
                <Link
                  to={`/employees?department=${encodeURIComponent(dept.name)}`}
                  className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View full team
                  <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}