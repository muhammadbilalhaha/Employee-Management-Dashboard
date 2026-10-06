import { POSITIONS } from "./notificationsSlice";

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

/**
 * Build the notification payload for a newly created employee.
 *
 * @param {Object} employee - the new employee record
 * @param {Object} recipient - { email, position, customTitle }
 * @returns {{ to, title, subject, body }}
 */
export function buildNewEmployeeEmail(employee, recipient) {
  const title =
    recipient.position === "Custom"
      ? recipient.customTitle || "Custom"
      : recipient.position;

  const fullName = `${employee.firstName} ${employee.lastName}`;

  const subject = `New Employee Added — ${fullName}`;

  const body = [
    `Dear ${title},`,
    "",
    "A new employee has been added to the system.",
    "",
    `  Name:       ${fullName}`,
    `  Email:      ${employee.email}`,
    `  Phone:      ${employee.phone || "—"}`,
    `  Department: ${employee.department}`,
    `  Role:       ${employee.role}`,
    `  Location:   ${employee.location || "—"}`,
    `  Salary:     ${formatSalary(employee.salary)}`,
    `  Joined:     ${formatDate(employee.joiningDate)}`,
    `  Status:     ${employee.status}`,
    "",
    "— Employee Management Dashboard",
    "This is an automated notification.",
  ].join("\n");

  return {
    to: recipient.email,
    title,
    subject,
    body,
  };
}