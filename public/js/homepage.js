// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Select all elements with the class 'post-link'
    const postLinks = document.querySelectorAll('.post-link');
  
    // Add a click event listener to each post link
    postLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default action of the link
  
        const postId = this.getAttribute('data-id'); // Get the ID of the post from the data attribute
  
        // Fetch the login status from the server
        fetch('/api/check-login') // This endpoint should return { loggedIn: true/false }
          .then(response => response.json())
          .then(data => {
            if (data.loggedIn) {
              // If the user is logged in, redirect to the post detail page
              window.location.href = `/post/${postId}`;
            } else {
              // If the user is not logged in, redirect to the login page
              window.location.href = '/login';
            }
          })
          .catch(error => {
            console.error('Error:', error);
            // Redirect to the login page in case of an error
            window.location.href = '/login';
          });
      });
    });
  
    // Example function to handle additional functionality on the homepage
    function handleAdditionalFeatures() {
      // Implement any additional features or event listeners here
      // For example, if you want to add a click event to a button:
      const someButton = document.querySelector('.some-button');
      if (someButton) {
        someButton.addEventListener('click', () => {
          // Handle button click
          console.log('Button clicked!');
        });
      }
    }
  
    // Call the additional functionality handler
    handleAdditionalFeatures();
  });
  