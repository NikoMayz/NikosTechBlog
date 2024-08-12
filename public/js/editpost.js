// Function to update an existing post via the backend
const updatePost = async (postId, title, description) => {
  try {
    const response = await fetch(`/api/posts/user/${window.currentUser.id}/post/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update post');
  } catch (error) {
    console.error('Error updating post:', error.message);
    return null;
  }
};

// Handle form submission for updating a post
// Handle form submission for updating a post
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#edit-post-form');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.querySelector('#title').value.trim();
      const description = document.querySelector('#description').value.trim();
      const postId = window.location.pathname.split('/').pop();

      console.log(`Submitting form with postId: ${postId}, title: ${title}, description: ${description}`);

      if (title && description && postId) {
        const response = await updatePost(postId, title, description);

        if (response) {
          alert('Post updated successfully');
          window.location.href = '/dashboard'; // Redirect to dashboard or another appropriate page
        } else {
          alert('Failed to update post');
        }
      } else {
        alert('Please provide both title and description.');
      }
    });
  }
});