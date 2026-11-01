// Hard-coded sample team for the prototype.
// Team tasks and the Manager's dashboard both load this file, so they always show
// the same people and the same tasks. In Part 2 this data will come from the database.
//
// These are tasks a manager has ASSIGNED (team/project tasks). Employees' personal
// to-do lists (My tasks) are private and are never included here.

const TEAM_MEMBERS = [
  { name: "Daniel Brooks", role: "Developer" },
  { name: "Priya Shah",    role: "UX Designer" },
  { name: "Lewis Turner",  role: "Developer" }
];

// status: "To do" | "In progress" | "Done"
// priority: "low" | "medium" | "high"     complexity: "easy" | "medium" | "hard"
// hours: estimated hours to complete       deadline: "YYYY-MM-DD"
const TEAM_TASKS = [
  { id: 1,  title: "Build the project overview page",      owner: "Daniel Brooks", project: "Project Portal",  status: "In progress", priority: "high",   complexity: "hard",   hours: 8,  deadline: "2026-11-10" },
  { id: 2,  title: "Check the mobile layout",              owner: "Daniel Brooks", project: "Project Portal",  status: "To do",       priority: "medium", complexity: "easy",   hours: 3,  deadline: "2026-10-28" },
  { id: 3,  title: "Fix sign-in form spacing",             owner: "Daniel Brooks", project: "Staff Tools",     status: "Done",        priority: "low",    complexity: "easy",   hours: 1,  deadline: "2026-10-20" },
  { id: 4,  title: "Prepare the onboarding checklist",     owner: "Daniel Brooks", project: "HR onboarding",   status: "Done",        priority: "medium", complexity: "easy",   hours: 2,  deadline: "2026-10-22" },
  { id: 5,  title: "Review dashboard wireframes",          owner: "Priya Shah",    project: "Project Portal",  status: "Done",        priority: "high",   complexity: "medium", hours: 4,  deadline: "2026-10-21" },
  { id: 6,  title: "Prepare icons for the task list",      owner: "Priya Shah",    project: "Staff Tools",     status: "In progress", priority: "low",    complexity: "easy",   hours: 4,  deadline: "2026-11-14" },
  { id: 7,  title: "Confirm replacement equipment",        owner: "Priya Shah",    project: "Network upgrade", status: "Done",        priority: "medium", complexity: "easy",   hours: 2,  deadline: "2026-10-15" },
  { id: 8,  title: "Connect the task filters",             owner: "Lewis Turner",  project: "Project Portal",  status: "To do",       priority: "high",   complexity: "medium", hours: 6,  deadline: "2026-10-29" },
  { id: 9,  title: "Test the registration page",           owner: "Lewis Turner",  project: "Staff Tools",     status: "In progress", priority: "medium", complexity: "medium", hours: 5,  deadline: "2026-11-12" },
  { id: 10, title: "Update the help page links",           owner: "Lewis Turner",  project: "Staff Tools",     status: "Done",        priority: "low",    complexity: "easy",   hours: 1,  deadline: "2026-10-19" },
  { id: 11, title: "Schedule new starter sessions",        owner: "Lewis Turner",  project: "HR onboarding",   status: "To do",       priority: "low",    complexity: "easy",   hours: 2,  deadline: "2026-10-27" },
  { id: 12, title: "Install replacement network switches", owner: "Lewis Turner",  project: "Network upgrade", status: "In progress", priority: "high",   complexity: "hard",   hours: 12, deadline: "2026-10-24" }
];
