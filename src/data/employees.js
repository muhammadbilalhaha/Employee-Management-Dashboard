export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "HR",
  "Marketing",
  "Finance",
  "Sales",
];

export const ROLES_BY_DEPARTMENT = {
  Engineering: [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
  ],
  Design: ["UI Designer", "UX Designer", "Product Designer", "Graphic Designer"],
  HR: ["HR Manager", "Recruiter", "HR Executive"],
  Marketing: ["Marketing Manager", "SEO Specialist", "Content Writer", "Social Media Manager"],
  Finance: ["Accountant", "Financial Analyst", "Finance Manager"],
  Sales: ["Sales Executive", "Sales Manager", "Business Development Officer"],
};

export const LOCATIONS = [
  "Islamabad",
  "Karachi",
  "Lahore",
  "Rawalpindi",
  "Peshawar",
  "Multan",
];

export const STATUSES = ["Active", "Inactive"];

const firstNames = [
  "Ali", "Sara", "Usman", "Ayesha", "Bilal", "Fatima", "Hassan", "Zainab",
  "Ahmed", "Maryam", "Omar", "Hira", "Kamran", "Sana", "Faisal", "Nadia",
  "Tariq", "Rida", "Imran", "Areeba", "Danish", "Iqra", "Salman", "Mahnoor",
  "Zeeshan", "Laiba", "Adnan", "Kiran", "Waqar", "Anum", "Shahid", "Rabia",
  "Naveed", "Sadia", "Asad", "Noor", "Junaid", "Mehwish", "Rizwan", "Aiman",
  "Yasir", "Farah",
];

const lastNames = [
  "Khan", "Ahmed", "Ali", "Malik", "Sheikh", "Butt", "Chaudhry", "Raza",
  "Hussain", "Iqbal", "Mahmood", "Siddiqui", "Farooq", "Nawaz", "Akhtar",
];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export function generateEmployees(count = 42) {
  const employees = [];

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i * 3) % lastNames.length];
    const department = DEPARTMENTS[Math.floor(seededRandom(seed * 2) * DEPARTMENTS.length)];
    const role = pick(ROLES_BY_DEPARTMENT[department], seed * 5);
    const location = pick(LOCATIONS, seed * 7);
    const status = seededRandom(seed * 11) > 0.15 ? "Active" : "Inactive";
    const salary = Math.round((50000 + seededRandom(seed * 13) * 150000) / 1000) * 1000;

    const year = 2018 + Math.floor(seededRandom(seed * 17) * 8);
    const month = 1 + Math.floor(seededRandom(seed * 19) * 12);
    const day = 1 + Math.floor(seededRandom(seed * 23) * 28);
    const joiningDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    employees.push({
      id: seed,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${seed}@company.com`,
      phone: `03${String(Math.floor(seededRandom(seed * 29) * 100000000)).padStart(9, "0")}`,
      department,
      role,
      salary,
      joiningDate,
      status,
      location,
      avatar: null,
    });
  }

  return employees;
}