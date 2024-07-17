// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login');
  
  // Check if the login button exists on the page
  if (loginButton) {
    // Add an event listener to handle the login button click
    loginButton.addEventListener('click', () => {
      // Redirect the user to the login page
      window.location.href = '/login';
    });
  }

  // Add event listener for the login form submission
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
    
      const userName = document.querySelector('#userName').value.trim();
      const password = document.querySelector('#password').value.trim();
    
      if (userName && password) {
        try {
          const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ userName, password }),
            headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.ok) {
            document.location.replace('/');
          } else {
            alert('Failed to log in.');
          }
        } catch (error) {
          console.error('Error logging in:', error);
          alert('Failed to log in. Please try again.');
        }
      }
    });
  }
});
