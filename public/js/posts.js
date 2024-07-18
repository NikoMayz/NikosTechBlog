
// Utility function to handle fetch requests
const fetchData = async (url, options = {}) => {
  try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error('Fetch error:', error.message);
      return null;
  }
};

// Function to fetch all posts from the backend
const getAllPosts = () => fetchData('/api/posts/posts');

// Function to fetch posts by username from the backend
const getPostsByUser = (userName) => fetchData(`/api/posts/posts/${userName}`);

// Function to create a new post via the backend
const createPost = (title, description) => {
  return fetchData('/api/posts/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
  });
};

// Function to update an existing post via the backend
const updatePost = (postId, updatedData) => {
  return fetchData(`/api/posts/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
  });
};

// Function to delete a post via the backend
const deletePost = (postId) => {
  return fetchData(`/api/posts/posts/${postId}`, {
      method: 'DELETE',
  });
};

document.addEventListener('DOMContentLoaded', () => {
  // Event listener for creating a new post
  document.querySelector('#new-post-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.querySelector('#title').value.trim();
      const description = document.querySelector('#description').value.trim();
      
      if (title && description) {
          const newPost = await createPost(title, description);
          if (newPost) {
              console.log('New post created:', newPost);
              // Optionally refresh or redirect
          } else {
              console.error('Failed to create post.');
          }
      }
  });
});

// // Event listener for updating a post
// document.querySelector('#update-post-form').addEventListener('submit', async (event) => {
//   event.preventDefault();
//   const postId = document.querySelector('#post-id').value.trim();
//   const updatedTitle = document.querySelector('#updated-title').value.trim();
//   const updatedDescription = document.querySelector('#updated-description').value.trim();
  
//   if (postId && updatedTitle && updatedDescription) {
//       const updatedPost = await updatePost(postId, { title: updatedTitle, description: updatedDescription });
//       if (updatedPost) {
//           console.log('Post updated:', updatedPost);
//           // Optionally refresh or redirect
//       } else {
//           console.error('Failed to update post.');
//       }
//   }
// });

// // Event listener for deleting a post
// document.querySelector('#delete-post-button').addEventListener('click', async (event) => {
//   event.preventDefault();
//   const postId = document.querySelector('#post-id').value.trim();
  
//   if (postId) {
//       const deleted = await deletePost(postId);
//       if (deleted) {
//           console.log('Post deleted successfully.');
//           // Optionally refresh or redirect
//       } else {
//           console.error('Failed to delete post.');
//       }
//   }
// });

// // Export functions for use in other parts of the frontend
// // export { getAllPosts, getPostsByUser };
