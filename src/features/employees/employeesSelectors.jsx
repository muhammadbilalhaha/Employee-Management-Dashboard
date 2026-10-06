import { createSelector } from "@reduxjs/toolkit";

export const selectAllEmployees = (state) => state.employees.employees;
export const selectSearchTerm = (state) => state.employees.searchTerm;
export const selectDepartmentFilter = (state) => state.employees.departmentFilter;
export const selectStatusFilter = (state) => state.employees.statusFilter;
export const selectSortBy = (state) => state.employees.sortBy;
export const selectCurrentPage = (state) => state.employees.currentPage;
export const selectPageSize = (state) => state.employees.pageSize;

export const selectFilteredEmployees = createSelector(
  [selectAllEmployees, selectSearchTerm, selectDepartmentFilter, selectStatusFilter, selectSortBy],
  (employees, searchTerm, departmentFilter, statusFilter, sortBy) => {
    const term = searchTerm.trim().toLowerCase();

    let result = employees.filter((e) => {
      const matchesSearch =
        !term ||
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.role.toLowerCase().includes(term);

      const matchesDepartment = departmentFilter === "All" || e.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    const [field, direction] = sortBy.split("-");

    result = [...result].sort((a, b) => {
      let aVal, bVal;
      switch (field) {
        case "name":
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "joining":
          aVal = new Date(a.joiningDate).getTime();
          bVal = new Date(b.joiningDate).getTime();
          break;
        case "salary":
          aVal = a.salary;
          bVal = b.salary;
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }
);

export const selectPaginatedEmployees = createSelector(
  [selectFilteredEmployees, selectCurrentPage, selectPageSize],
  (filtered, page, pageSize) => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }
);

export const selectTotalFiltered = createSelector(
  [selectFilteredEmployees],
  (filtered) => filtered.length
);

export const selectTotalPages = createSelector(
  [selectFilteredEmployees, selectPageSize],
  (filtered, pageSize) => Math.max(1, Math.ceil(filtered.length / pageSize))
);

export const selectDashboardStats = createSelector([selectAllEmployees], (employees) => ({
  total: employees.length,
  active: employees.filter((e) => e.status === "Active").length,
  inactive: employees.filter((e) => e.status === "Inactive").length,
  departments: new Set(employees.map((e) => e.department)).size,
}));

export const selectDepartmentCounts = createSelector([selectAllEmployees], (employees) => {
  const counts = {};
  employees.forEach((e) => {
    counts[e.department] = (counts[e.department] || 0) + 1;
  });
  return counts;
});

export const selectEmployeeById = (id) =>
  createSelector([selectAllEmployees], (employees) =>
    employees.find((e) => String(e.id) === String(id))
  );