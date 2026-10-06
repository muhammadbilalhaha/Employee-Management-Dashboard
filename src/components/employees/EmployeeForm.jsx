import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import {
  DEPARTMENTS,
  ROLES_BY_DEPARTMENT,
  LOCATIONS,
  STATUSES,
} from "../../data/employees";
import {
  addEmployee,
  updateEmployee,
} from "../../features/employees/employeesSlice";
import { recordSent } from "../../features/notifications/notificationsSlice";
import { sendNewEmployeeEmail } from "../../features/notifications/sendEmail";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "Engineering",
  role: "",
  salary: "",
  joiningDate: new Date().toISOString().split("T")[0],
  location: "Islamabad",
  status: "Active",
};

export default function EmployeeForm({
  open,
  onClose,
  employee = null, // null = Add mode, object = Edit mode
}) {
  const dispatch = useDispatch();
  const isEdit = !!employee;

  // Read the configured notification recipient from Redux
  const recipient = useSelector((state) => state.notifications.recipient);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form when employee changes (edit) or modal opens (add)
  useEffect(() => {
    if (!open) return;
    if (employee) {
      setForm({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "Engineering",
        role: employee.role || "",
        salary: String(employee.salary ?? ""),
        joiningDate: employee.joiningDate || EMPTY_FORM.joiningDate,
        location: employee.location || "Islamabad",
        status: employee.status || "Active",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // Reset role if department changes and current role isn't valid for the new one
      if (name === "department") {
        const roles = ROLES_BY_DEPARTMENT[value] || [];
        return {
          ...prev,
          department: value,
          role: roles.includes(prev.role) ? prev.role : "",
        };
      }
      return { ...prev, [name]: value };
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};

    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";

    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^[0-9+\-\s()]{7,}$/.test(form.phone))
      errs.phone = "Please enter a valid phone number";

    if (!form.role) errs.role = "Role is required";

    if (form.salary === "" || form.salary === null)
      errs.salary = "Salary is required";
    else if (Number(form.salary) <= 0)
      errs.salary = "Salary must be greater than 0";

    if (!form.joiningDate) errs.joiningDate = "Joining date is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Small delay to mimic server round-trip for the employee record itself
    await new Promise((r) => setTimeout(r, 400));

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department,
      role: form.role,
      salary: Number(form.salary),
      joiningDate: form.joiningDate,
      location: form.location,
      status: form.status,
    };

    if (isEdit) {
      dispatch(updateEmployee({ id: employee.id, ...payload }));
    } else {
      // 1. Add employee to Redux
      dispatch(addEmployee(payload));

      // 2. Send real email via EmailJS (only on Create, not Edit)
      if (recipient?.enabled && recipient?.email) {
        const result = await sendNewEmployeeEmail(payload, recipient);

        if (result.ok) {
          console.log(
            `%c✅ Email sent to ${recipient.email}`,
            "color: #16a34a; font-weight: bold;"
          );
        } else {
          console.warn(
            `%c⚠️ Email failed: ${result.error}`,
            "color: #dc2626; font-weight: bold;"
          );
        }

        // Record the attempt in Redux so Settings can show "Last Notification"
        dispatch(
          recordSent({
            to: recipient.email,
            title:
              recipient.position === "Custom"
                ? recipient.customTitle || "Custom"
                : recipient.position,
            subject: `New Employee Added — ${payload.firstName} ${payload.lastName}`,
            ok: result.ok,
            error: result.error || null,
          })
        );
      }
    }

    setSubmitting(false);
    onClose();
  };

  const roles = ROLES_BY_DEPARTMENT[form.department] || [];

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title={isEdit ? "Edit Employee" : "Add New Employee"}
      description={
        isEdit
          ? `Update the details for ${employee.firstName} ${employee.lastName}.`
          : "Fill in the information below to add a new team member."
      }
      size="lg"
      closeOnBackdrop={!submitting}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          {/* Name row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Muhammad"
              autoFocus
            />
            <Input
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Bilal"
            />
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="bilal@example.com"
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="03001234567"
            />
          </div>

          {/* Department + Role */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            />
            <div>
              <Select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select a role..." },
                  ...roles.map((r) => ({ value: r, label: r })),
                ]}
              />
              {errors.role && (
                <p className="mt-1 text-xs text-danger">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Salary + Joining Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Salary (PKR)"
              name="salary"
              type="number"
              min="0"
              step="1000"
              value={form.salary}
              onChange={handleChange}
              error={errors.salary}
              placeholder="90000"
            />
            <Input
              label="Joining date"
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              error={errors.joiningDate}
            />
          </div>

          {/* Location + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              options={LOCATIONS.map((l) => ({ value: l, label: l }))}
            />
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Save changes" : "Create employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}