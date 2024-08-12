// Function to create a new post via the backend
const createPost = async (title, description) => {
  try {
    const response = await fetch(`/api/posts/user/${window.currentUser.id}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
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
    const updatedAt = new Date(post.updatedAt).toLocaleDateString(); // Convert updatedAt to a readable format

    const userName = post.user ? post.user.userName : 'Unknown User';

    postElement.innerHTML = `
      <a href="/editpost/${post.id}" class="post-title">${post.title}</a> - Created: ${createdAt} | Updated: ${updatedAt} (User: ${userName})
      <button class="delete-post-button" data-id="${post.id}">Delete</button>
    `;
    postsContainer.appendChild(postElement);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-post-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const postId = event.target.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this post?')) {
        const response = await deletePost(postId);
        if (response) {
          alert('Post deleted successfully');
          // Refresh the posts list
          const posts = await getPostsByUser(window.currentUser.id);
          if (posts) {
            renderPosts(posts);
          }
        } else {
          alert('Failed to delete post');
        }
      }
    });
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

// Event listener for creating a new post
const newPostForm = document.querySelector('#new-post-form');
if (newPostForm) {
  newPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();

    if (title && description && window.currentUser) {
      const response = await createPost(title, description);
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
