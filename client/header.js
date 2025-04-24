document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const headerActions = document.getElementById('header-actions');

  if (!headerActions) return;

  if (currentUser) {
    const welcomeText = document.createElement('span');
    welcomeText.className = 'align-self-center fw-semibold me-2';
    welcomeText.textContent = `Hello, ${currentUser.name}`;

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-outline-dark';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      // Redirect to home page after logout, keep existing header intact
      window.location.href = '../index.html'; // Adjust path to your home page
    });

    // Remove previous content and add new buttons
    headerActions.innerHTML = '';
    headerActions.appendChild(welcomeText);
    headerActions.appendChild(logoutBtn);

    // Optionally add cart link
    const cartLink = document.createElement('a');
    cartLink.className = 'btn btn-outline-dark';
    cartLink.href = 'cart/index.html';
    cartLink.innerHTML = '<i class="bi bi-cart4"></i>';
    headerActions.appendChild(cartLink);
  } else {
    // User is not logged in, keep original header buttons for login and register
    // Do nothing, the header stays as it is, no modification needed
  }
});