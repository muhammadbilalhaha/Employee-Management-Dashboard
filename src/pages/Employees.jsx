import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPaginatedEmployees,
  selectTotalFiltered,
  selectTotalPages,
  selectCurrentPage,
  selectPageSize,
} from "../features/employees/employeesSelectors";
import {
  setCurrentPage,
  setPageSize,
  resetFilters,
  deleteEmployee,
} from "../features/employees/employeesSlice";
import { Card, CardContent } from "../components/common/Card";
import EmployeeFilters from "../components/employees/EmployeeFilters";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeForm from "../components/employees/EmployeeForm";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { setDepartmentFilter } from "../features/employees/employeesSlice";

export default function Employees() {
  const dispatch = useDispatch();

  const employees = useSelector(selectPaginatedEmployees);
  const totalFiltered = useSelector(selectTotalFiltered);
  const totalPages = useSelector(selectTotalPages);
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const dept = searchParams.get("department");
    if (dept && dept !== "All") {
      dispatch(setDepartmentFilter(dept));
      // Clean the URL so a refresh doesn't re-apply it
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePageSizeChange = (size) => {
    dispatch(setPageSize(size));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  const handleDelete = (emp) => setDeletingEmployee(emp);

  const confirmDelete = () => {
    if (!deletingEmployee) return;
    setDeleting(true);
    // Simulate API delay
    setTimeout(() => {
      dispatch(deleteEmployee(deletingEmployee.id));
      setDeleting(false);
      setDeletingEmployee(null);
    }, 350);
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Employees</h2>
        <p className="text-sm text-muted-foreground">
          Manage your team members, their roles, and their information.
        </p>
      </div>

      <Card>
        <div className="border-b border-border p-4 lg:p-5">
          <EmployeeFilters onAddClick={handleAddClick} />
        </div>

        <CardContent className="p-0">
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onResetFilters={() => dispatch(resetFilters())}
          />
        </CardContent>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalFiltered}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

      </Card>

      {/* Add / Edit modal */}
      <EmployeeForm
        open={formOpen}
        onClose={handleCloseForm}
        employee={editingEmployee}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingEmployee}
        title="Delete employee?"
        description={
          deletingEmployee
            ? `Are you sure you want to delete ${deletingEmployee.firstName} ${deletingEmployee.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEmployee(null)}
      />
    </div>
  );
}