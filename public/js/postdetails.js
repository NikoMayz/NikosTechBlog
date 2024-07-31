  // Function to update an existing post
  const updatePost = async (postId, title, description) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
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
  
  // Function to delete a post
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/posts/${postId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        return response; // No need to parse JSON for DELETE
      }
      throw new Error('Failed to delete post');
    } catch (error) {
      console.error('Error deleting post:', error.message);
      return null;
    }
  };
  
  // On DOMContentLoaded, fetch post details and set up event listeners
  document.addEventListener('DOMContentLoaded', async () => {
    const postId = window.location.pathname.split('/').pop(); // Extract postId from URL
    const post = await fetchPostDetails(postId);
  
    if (post) {
      document.querySelector('#edit-title').value = post.title;
      document.querySelector('#edit-description').value = post.description;
  
      document.querySelector('#edit-post-button').addEventListener('click', () => {
        document.querySelector('#edit-section').style.display = 'block';
      });
  
      document.querySelector('#cancel-edit-button').addEventListener('click', () => {
        document.querySelector('#edit-section').style.display = 'none';
      });
  
      document.querySelector('#edit-post-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.querySelector('#edit-title').value.trim();
        const description = document.querySelector('#edit-description').value.trim();
  
        if (title && description) {
          const updatedPost = await updatePost(postId, title, description);
          if (updatedPost) {
            alert('Post updated successfully');
            window.location.reload(); // Refresh the page to show updated post
          } else {
            alert('Failed to update post');
          }
        }
      });
  
      document.querySelector('#delete-post-button').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this post?')) {
          const response = await deletePost(postId);
          if (response) {
            alert('Post deleted successfully');
            window.location.href = '/dashboard'; // Redirect to dashboard after deletion
          } else {
            alert('Failed to delete post');
          }
        }
      });
    }
  });
  