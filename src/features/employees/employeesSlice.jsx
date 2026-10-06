import { createSlice, nanoid } from "@reduxjs/toolkit";
import { generateEmployees } from "../../data/employees";

const STORAGE_KEY = "ems_employees";

function loadInitialEmployees() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupted data
  }
  return generateEmployees(42);
}

const initialState = {
  employees: loadInitialEmployees(),
  searchTerm: "",
  departmentFilter: "All",
  statusFilter: "All",
  sortBy: "name-asc",
  currentPage: 1,
  pageSize: 8, // changed from 10 → 8 to match new pagination design
  loading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: {
      reducer(state, action) {
        state.employees.unshift(action.payload);
      },
      prepare(employeeData) {
        return {
          payload: {
            id: nanoid(),
            avatar: null,
            ...employeeData,
          },
        };
      },
    },
    updateEmployee(state, action) {
      const index = state.employees.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...action.payload };
      }
    },
    deleteEmployee(state, action) {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setDepartmentFilter(state, action) {
      state.departmentFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setSort(state, action) {
      state.sortBy = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    resetFilters(state) {
      state.searchTerm = "";
      state.departmentFilter = "All";
      state.statusFilter = "All";
      state.sortBy = "name-asc";
      state.currentPage = 1;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSearchTerm,
  setDepartmentFilter,
  setStatusFilter,
  setSort,
  setCurrentPage,
  setPageSize,
  resetFilters,
  setLoading,
  setError,
} = employeesSlice.actions;

export default employeesSlice.reducer;