// posts.js

// Function to fetch all posts from the backend
const getAllPosts = async () => {
    try {
      const response = await fetch('/api/posts/posts');
      if (response.ok) {
        const postData = await response.json();
        return postData;
      }
      throw new Error('Failed to fetch posts');
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      return null;
    }
  };
  
  // Function to fetch posts by username from the backend
  const getPostsByUser = async (userName) => {
    try {
      const response = await fetch(`/api/posts/posts/${userName}`);
      if (response.ok) {
        const postData = await response.json();
        return postData;
      }
      throw new Error('Failed to fetch posts by user');
    } catch (error) {
      console.error(`Error fetching posts by user ${userName}:`, error.message);
      return null;
    }
  };
  
  // Function to create a new post via the backend
  const createPost = async (title, description) => {
    try {
      const response = await fetch('/api/posts/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const postData = await response.json();
        return postData;
      }
      throw new Error('Failed to create post');
    } catch (error) {
      console.error('Error creating post:', error.message);
      return null;
    }
  };
  
  // Function to update an existing post via the backend
  const updatePost = async (postId, updatedData) => {
    try {
      const response = await fetch(`/api/posts/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const postData = await response.json();
        return postData;
      }
      throw new Error('Failed to update post');
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error.message);
      return null;
    }
  };
  
  // Function to delete a post via the backend
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        return true;
      }
      throw new Error('Failed to delete post');
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error.message);
      return false;
    }
  };
  
  // Event listener for creating a new post
  document.querySelector('#create-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.querySelector('#post-title').value.trim();
    const description = document.querySelector('#post-description').value.trim();
    
    if (title && description) {
      const newPost = await createPost(title, description);
      if (newPost) {
        // Optionally handle success action, e.g., redirect to dashboard or refresh posts
        console.log('New post created:', newPost);
      } else {
        // Handle error, e.g., display an error message to the user
        console.error('Failed to create post.');
      }
    }
  });
  
  // Event listener for updating a post
  document.querySelector('#update-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const postId = document.querySelector('#post-id').value.trim();
    const updatedTitle = document.querySelector('#updated-title').value.trim();
    const updatedDescription = document.querySelector('#updated-description').value.trim();
    
    if (postId && updatedTitle && updatedDescription) {
      const updatedPost = await updatePost(postId, { title: updatedTitle, description: updatedDescription });
      if (updatedPost) {
        // Optionally handle success action, e.g., redirect to updated post or refresh posts
        console.log('Post updated:', updatedPost);
      } else {
        // Handle error, e.g., display an error message to the user
        console.error('Failed to update post.');
      }
    }
  });
  
  // Event listener for deleting a post
  document.querySelector('#delete-post-button').addEventListener('click', async (event) => {
    event.preventDefault();
    const postId = document.querySelector('#post-id').value.trim();
    
    if (postId) {
      const deleted = await deletePost(postId);
      if (deleted) {
        // Optionally handle success action, e.g., redirect to dashboard or refresh posts
        console.log('Post deleted successfully.');
      } else {
        // Handle error, e.g., display an error message to the user
        console.error('Failed to delete post.');
      }
    }
  });
  
  // Export functions for use in other parts of the frontend
  export { getAllPosts, getPostsByUser };
  