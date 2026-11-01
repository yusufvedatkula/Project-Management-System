// Shared by every page you need to be logged in to see.
// It checks who is logged in, shows their details at the bottom of the sidebar,
// controls which pages they can see (employee or manager), and makes Log out work.

// Pages only managers can open
const MANAGER_PAGES = ['team-tasks.html', 'managers-dashboard.html'];

function setUpSidebar() {
  // The login page saves the logged-in user here (see auth/auth.js)
  const session = JSON.parse(localStorage.getItem('demoSession') || 'null');

  // Nobody logged in: send them to the login page instead
  if (!session) {
    window.location.replace('../auth/login.html');
    return;
  }

  const role = session.role || 'employee';   // older sessions without a role count as employee
  const isManager = role === 'manager';

  // An employee who opens a manager page directly (e.g. by typing its address) is sent back
  const currentPage = window.location.pathname.split('/').pop();
  if (!isManager && MANAGER_PAGES.includes(currentPage)) {
    window.location.replace('../my-tasks/my-tasks.html');
    return;
  }

  // Hide manager-only links from employees' sidebars
  if (!isManager) {
    document.querySelectorAll('.sidebar a').forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop();
      if (MANAGER_PAGES.includes(linkPage)) {
        link.remove();
      }
    });
  }

  // Fill in the user details at the bottom of the sidebar
  document.getElementById('sidebar-user-name').textContent = session.firstname;
  document.getElementById('sidebar-user-email').textContent = session.email;

  // Show which kind of account this is, under the email
  const roleLabel = document.createElement('span');
  roleLabel.className = 'sidebar-user-role';
  roleLabel.textContent = isManager ? 'Manager account' : 'Employee account';
  document.getElementById('sidebar-user-email').after(roleLabel);

  // Log out: forget the session, then go back to the login page
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('demoSession');
    window.location.href = '../auth/login.html';
  });
}

setUpSidebar();
