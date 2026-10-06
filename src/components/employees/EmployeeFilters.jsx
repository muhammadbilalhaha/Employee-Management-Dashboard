import { useDispatch, useSelector } from "react-redux";
import { Search, X, RotateCcw } from "lucide-react";
import { DEPARTMENTS, STATUSES } from "../../data/employees";
import {
    setSearchTerm,
    setDepartmentFilter,
    setStatusFilter,
    setSort,
    resetFilters,
} from "../../features/employees/employeesSlice";
import {
    selectSearchTerm,
    selectDepartmentFilter,
    selectStatusFilter,
    selectSortBy,
} from "../../features/employees/employeesSelectors";
import Select from "../common/Select";
import Button from "../common/Button";

const SORT_OPTIONS = [
    { value: "name-asc", label: "Name A → Z" },
    { value: "name-desc", label: "Name Z → A" },
    { value: "joining-desc", label: "Newest Joining Date" },
    { value: "joining-asc", label: "Oldest Joining Date" },
    { value: "salary-asc", label: "Salary Low → High" },
    { value: "salary-desc", label: "Salary High → Low" },
];

const DEPARTMENT_OPTIONS = [
    { value: "All", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
];

const STATUS_OPTIONS = [
    { value: "All", label: "All Status" },
    ...STATUSES.map((s) => ({ value: s, label: s })),
];

export default function EmployeeFilters({ onAddClick }) {
    const dispatch = useDispatch();

    const searchTerm = useSelector(selectSearchTerm);
    const departmentFilter = useSelector(selectDepartmentFilter);
    const statusFilter = useSelector(selectStatusFilter);
    const sortBy = useSelector(selectSortBy);

    const hasActiveFilters =
        searchTerm || departmentFilter !== "All" || statusFilter !== "All";

    return (
        <div className="space-y-3">
            {/* Row 1: search + add */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        className="h-10 w-full rounded-md border border-border bg-white pl-9 pr-9 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => dispatch(setSearchTerm(""))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <Button onClick={onAddClick} className="sm:w-auto">
                    + Add Employee
                </Button>
            </div>

            {/* Row 2: filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                    value={departmentFilter}
                    onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
                    options={DEPARTMENT_OPTIONS}
                />
                <Select
                    value={statusFilter}
                    onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                    options={STATUS_OPTIONS}
                />
                <Select
                    value={sortBy}
                    onChange={(e) => dispatch(setSort(e.target.value))}
                    options={SORT_OPTIONS}
                />
                <Button
                    variant="outline"
                    onClick={() => dispatch(resetFilters())}
                    disabled={!hasActiveFilters}
                    className="w-full"
                >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                </Button>
            </div>
        </div>
    );
}