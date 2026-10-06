import { createSlice, nanoid } from "@reduxjs/toolkit";

const STORAGE_KEY = "ems_auth";
const USERS_KEY = "ems_users";

export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123",
};

// Seed one demo account so login always works out of the box
const DEMO_USER = {
  id: "demo-admin",
  name: "Admin User",
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
  role: "Administrator",
};

function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [DEMO_USER];
}

function loadAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { user: null, isAuthenticated: false, error: null };
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...loadAuth(),
    users: loadUsers(),
  },
  reducers: {
    login(state, action) {
      const { email, password } = action.payload;
      const match = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (match) {
        const { password: _pw, ...safeUser } = match;
        state.user = safeUser;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = "Invalid email or password";
      }
    },

    register(state, action) {
      const { name, email, password } = action.payload;

      const exists = state.users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        state.error = "An account with this email already exists";
        return;
      }

      const newUser = {
        id: nanoid(),
        name,
        email,
        password, // stored in plaintext ONLY because this is a demo
        role: "Employee",
      };

      state.users.push(newUser);

      const { password: _pw, ...safeUser } = newUser;
      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { login, register, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;