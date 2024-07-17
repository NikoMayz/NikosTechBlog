// comments.js

// Function to fetch all comments from the backend
const getAllComments = async () => {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const commentData = await response.json();
        return commentData;
      }
      throw new Error('Failed to fetch comments');
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      return null;
    }
  };
  
  // Function to create a new comment via the backend
  const createComment = async (postId, commentText) => {
    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (response.ok) {
        const commentData = await response.json();
        return commentData;
      }
      throw new Error('Failed to create comment');
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error.message);
      return null;
    }
  };
  
  // Function to delete a comment via the backend
  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        return true;
      }
      throw new Error('Failed to delete comment');
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error.message);
      return false;
    }
  };
  
  // Event listener for creating a new comment
  document.querySelector('#create-comment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const postId = document.querySelector('#post-id').value.trim();
    const commentText = document.querySelector('#comment-text').value.trim();
    
    if (postId && commentText) {
      const newComment = await createComment(postId, commentText);
      if (newComment) {
        // Optionally handle success action, e.g., refresh comments or display confirmation
        console.log('New comment created:', newComment);
      } else {
        // Handle error, e.g., display an error message to the user
        console.error('Failed to create comment.');
      }
    }
  });
  
  // Event listener for deleting a comment
  document.querySelector('.delete-comment-button').addEventListener('click', async (event) => {
    event.preventDefault();
    const commentId = event.target.dataset.commentId;
    
    if (commentId) {
      const deleted = await deleteComment(commentId);
      if (deleted) {
        // Optionally handle success action, e.g., refresh comments or display confirmation
        console.log('Comment deleted successfully.');
      } else {
        // Handle error, e.g., display an error message to the user
        console.error('Failed to delete comment.');
      }
    }
  });
  
  // Export functions for use in other parts of the frontend
  export { getAllComments };
  