import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ynt0tfp"
const TEMPLATE_ID = "template_3tipoak"
const PUBLIC_KEY = "yvQunJCYobw-Yy2J5"

export async function sendNewEmployeeEmail(employee, recipient) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return {
      ok: false,
      error:
        "EmailJS is not configured. Add VITE_EMAILJS_* variables to your .env file.",
    };
  }

  const recipientTitle =
    recipient.position === "Custom"
      ? recipient.customTitle || "Custom"
      : recipient.position;

  const fullName = `${employee.firstName} ${employee.lastName}`;

  const templateParams = {
    to_email: recipient.email,
    recipient_title: recipientTitle,

    employee_name: fullName,
    employee_email: employee.email,
    employee_phone: employee.phone || "—",
    employee_department: employee.department,
    employee_role: employee.role,
    employee_location: employee.location || "—",
    employee_salary: new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(employee.salary),
    employee_joining: new Date(employee.joiningDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    employee_status: employee.status,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
    });
    return { ok: true };
  } catch (err) {
    console.error("EmailJS send failed:", err);
    return {
      ok: false,
      error: err?.text || err?.message || "Failed to send email",
    };
  }
}