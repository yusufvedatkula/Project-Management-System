// Shared by every page you need to be logged in to see.
// It checks who is logged in, shows their details at the bottom of the sidebar,
// and makes the Log out button work.
function setUpSidebar() {
  // The login page saves the logged-in user here (see auth/auth.js)
  const session = JSON.parse(localStorage.getItem('demoSession') || 'null');

  // Nobody logged in: send them to the login page instead
  if (!session) {
    window.location.replace('../auth/login.html');
    return;
  }

  // Fill in the user details at the bottom of the sidebar
  document.getElementById('sidebar-user-name').textContent = session.firstname;
  document.getElementById('sidebar-user-email').textContent = session.email;

  // Log out: forget the session, then go back to the login page
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('demoSession');
    window.location.href = '../auth/login.html';
  });
}

setUpSidebar();
