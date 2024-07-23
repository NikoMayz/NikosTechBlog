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

// Function to fetch posts by username from the backend
const getPostsByUser = (userId) => fetchData(`/api/posts/posts${userId}`);

// Function to create a new post via the backend
const createPost = async (title, description) => {
  try {
    const response = await fetch('/api/posts/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create post error:', error.message);
    return null;
  }
};
// Render posts to the DOM
const renderPosts = (posts) => {
  const postsContainer = document.querySelector('#your-posts-container');
  if (!postsContainer) {
    console.error('Posts container not found in the DOM.');
    return; // Early return if the container is not found
  }
  
  postsContainer.innerHTML = ''; // Clear existing posts

  posts.forEach(post => {
    console.log('Post:', post);

    const postElement = document.createElement('li');
    const createdAt = new Date(post.date_created).toLocaleDateString(); // Adjust format as needed

    const userName = post.user ? post.user.userName : 'Unknown User';
    console.log(`User Name:`, userName);

    postElement.innerHTML = `
      <a href="/posts/${post.id}">${post.title}</a> - ${createdAt} (User: ${post.userName})
      <span class="edit-delete">
        <a href="/posts/${post.id}/edit">Edit</a> | 
        <a href="/posts/${post.id}/delete">Delete</a>
      </span>
    `;
    postsContainer.appendChild(postElement);
  });
};

// Fetch posts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  const userName = window.currentUser.userName; // Retrieve username
  const posts = await getPostsByUser(userName);

  if (posts) {
    renderPosts(posts);
  }
  
  // Event listener for creating a new post
  const newPostForm = document.querySelector('#new-post-form');
  if (newPostForm) {
    newPostForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.querySelector('#title').value.trim();
      const description = document.querySelector('#description').value.trim();
      
      if (title && description) {
          const newPost = await createPost(title, description);
          if (newPost) {
              console.log('New post created:', newPost);
              renderPosts(await getPostsByUser(userName)); // Refresh the posts list
          } else {
              console.error('Failed to create post.');
          }
      }
    });
  }
});
