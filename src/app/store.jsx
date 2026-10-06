import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeesReducer from "../features/employees/employeesSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeesReducer,
    notifications: notificationsReducer,
  },
});

let prevEmployees = store.getState().employees.employees;
let prevAuth = store.getState().auth;
let prevUsers = store.getState().auth.users;
let prevRecipient = store.getState().notifications.recipient;

store.subscribe(() => {
  const state = store.getState();

  if (state.employees.employees !== prevEmployees) {
    prevEmployees = state.employees.employees;
    try {
      localStorage.setItem("ems_employees", JSON.stringify(prevEmployees));
    } catch {}
  }

  if (state.auth.users !== prevUsers) {
    prevUsers = state.auth.users;
    try {
      localStorage.setItem("ems_users", JSON.stringify(prevUsers));
    } catch {}
  }

  if (state.auth !== prevAuth) {
    prevAuth = state.auth;
    try {
      const { users, ...authPersist } = state.auth;
      localStorage.setItem("ems_auth", JSON.stringify(authPersist));
    } catch {}
  }

  if (state.notifications.recipient !== prevRecipient) {
    prevRecipient = state.notifications.recipient;
    try {
      localStorage.setItem(
        "ems_notification_recipient",
        JSON.stringify(prevRecipient)
      );
    } catch {}
  }
});