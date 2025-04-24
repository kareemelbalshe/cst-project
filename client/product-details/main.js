document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headerActions = document.getElementById('header-actions');
  
    if (!headerActions) return;
  
    if (currentUser) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-outline-dark';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
      });
  
      // Remove previous content and add new buttons
      headerActions.innerHTML = '';
  
      // Add profile button with user's name
      const profileLink = document.createElement('a');
      profileLink.className = 'btn btn-outline-dark me-2';
      profileLink.href = '../profile/index.html';
      profileLink.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${currentUser.name}`;
      headerActions.appendChild(profileLink);
  
      // Add cart link
      const cartLink = document.createElement('a');
      cartLink.className = 'btn btn-outline-dark me-2';
      cartLink.href = '../cart/index.html';
      cartLink.innerHTML = '<i class="bi bi-cart4"></i>';
      headerActions.appendChild(cartLink);
  
      // Add logout button
      headerActions.appendChild(logoutBtn);
  
    } else {
      // User is not logged in, keep original header buttons for login and register
      // Do nothing
    }
  });
  