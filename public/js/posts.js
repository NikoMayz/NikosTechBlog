// Function to create a new post via the backend
const createPost = async (title, description) => {
  try {
    const response = await fetch(`/api/posts/user/${window.currentUser.id}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }), // No need to send userId explicitly
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to create post');
  } catch (error) {
    console.error(`Error creating post for ${window.currentUser.id}:`, error.message);
    return null;
  }
};

// Function to update an existing post via the backend
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

// Function to delete an existing post via the backend
const deletePost = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
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

// Function to fetch posts by user ID from the backend
const getPostsByUser = async (userId) => {
  try {
    const response = await fetch(`/api/posts/user/${userId}`);
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch posts');
  } catch (error) {
    console.error('Fetch error:', error.message);
    return null;
  }
};

// Render posts to the DOM
const renderPosts = (posts) => {
  const postsContainer = document.querySelector('#your-posts-container');
  
  if (!postsContainer) {
    console.error('Posts container not found in the DOM.');
    return;
  }

  postsContainer.innerHTML = ''; // Clear existing posts

  posts.forEach((post) => {
    const postElement = document.createElement('li');
    const createdAt = new Date(post.date_created).toLocaleDateString();
    const userName = post.user ? post.user.userName : 'Unknown User';

    postElement.innerHTML = `
      <a href="/posts/${post.id}">${post.title}</a> - ${createdAt} (User: ${userName})
      <span class="edit-delete">
        <button data-id="${post.id}" class="edit-button">Edit</button>
        <button data-id="${post.id}" class="delete-button">Delete</button>
      </span>
    `;
    postsContainer.appendChild(postElement);
  });

  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-button').forEach((button) => {
    button.addEventListener('click', handleEditButtonClick);
  });

  document.querySelectorAll('.delete-button').forEach((button) => {
    button.addEventListener('click', handleDeleteButtonClick);
  });
};

// Fetch and render posts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  const user = await fetch('/api/users/current').then(res => res.json()).catch(() => null);
  
  if (user) {
    window.currentUser = user;
    const posts = await getPostsByUser(user.id);
    if (posts) {
      renderPosts(posts);
    }
  }
});

// Event listener for creating or updating a post
const newPostForm = document.querySelector('#new-post-form');
if (newPostForm) {
  newPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    const postId = newPostForm.dataset.id;

    if (title && description && window.currentUser) {
      let response;
      if (postId) {
        response = await updatePost(postId, title, description);
        if (response) {
          document.querySelector('#submit-button').textContent = 'Create Post';
          newPostForm.removeAttribute('data-id');
        }
      } else {
        response = await createPost(title, description);
      }

      if (response) {
        const posts = await getPostsByUser(window.currentUser.id);
        if (posts) {
          renderPosts(posts); // Refresh the posts list
          newPostForm.reset(); // Clear form fields
        }
      }
    }
  });
}

// Handle click event on edit buttons
const handleEditButtonClick = async (event) => {
  const postId = event.target.dataset.id;
  const post = await fetch(`/api/posts/${postId}`).then(res => res.json()).catch(() => null);
  
  if (post) {
    document.querySelector('#title').value = post.title;
    document.querySelector('#description').value = post.description;
    document.querySelector('#submit-button').textContent = 'Update Post';
    document.querySelector('#new-post-form').dataset.id = postId;
  }
};

// Handle click event on delete buttons
const handleDeleteButtonClick = async (event) => {
  const postId = event.target.dataset.id;
  if (confirm('Are you sure you want to delete this post?')) {
    const response = await deletePost(postId);
    if (response) {
      const posts = await getPostsByUser(window.currentUser.id);
      if (posts) {
        renderPosts(posts); // Refresh the posts list
      }
    } else {
      console.error('Failed to delete post.');
    }
  }
};
