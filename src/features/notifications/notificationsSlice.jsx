import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "ems_notification_recipient";

export const POSITIONS = [
  { value: "CEO", label: "CEO" },
  { value: "Manager", label: "Manager" },
  { value: "HR", label: "HR" },
  { value: "Custom", label: "Custom" },
];

const DEFAULT_RECIPIENT = {
  email: "ceo@company.com",
  position: "CEO",
  customTitle: "",
  enabled: true,
};

function loadRecipient() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // ignore corrupted data
  }
  return DEFAULT_RECIPIENT;
}

const initialState = {
  recipient: loadRecipient(),
  lastSent: null, // { to, title, subject, body, sentAt }
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setRecipient(state, action) {
      state.recipient = { ...state.recipient, ...action.payload };
    },
    recordSent(state, action) {
      state.lastSent = {
        ...action.payload,
        sentAt: new Date().toISOString(),
      };
    },
    clearLastSent(state) {
      state.lastSent = null;
    },
  },
});

export const { setRecipient, recordSent, clearLastSent } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;