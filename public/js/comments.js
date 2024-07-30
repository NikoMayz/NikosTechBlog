// Function to create a new comment via the backend
const createComment = async (postId, commentContent) => {
  try {
    const response = await fetch(`/api/comments/post/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentContent }),
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to create comment');
  } catch (error) {
    console.error(`Error creating comment for post ${postId}:`, error.message);
    return null;
  }
};

// Function to append a new comment to the comment section
const appendComment = (comment) => {
  let commentSection = document.querySelector('.comments');
  
  // If no comments section exists yet, create it
  if (!commentSection) {
    commentSection = document.createElement('div');
    commentSection.classList.add('comments');
    
    // Add a heading for the comments section
    const commentsHeader = document.createElement('h3');
    commentsHeader.textContent = 'Comments';
    commentSection.appendChild(commentsHeader);
    
    // Find the position where to insert the new comments section
    const commentForm = document.querySelector('.comment-form');
    commentForm.parentNode.insertBefore(commentSection, commentForm);
  }

  // Create and append the new comment
  const newComment = document.createElement('div');
  newComment.classList.add('comment');
  newComment.innerHTML = `
    <p class="comment-meta">
      <span>Comment by ${comment.user.userName} on ${new Date(comment.date_created).toLocaleString()}</span>
    </p>
    <p>${comment.content}</p>
  `;
  commentSection.appendChild(newComment);

  // Remove "No comments yet" message if present
  const noCommentsMessage = document.querySelector('.no-comments');
  if (noCommentsMessage) {
    noCommentsMessage.remove();
  }
};


// Event listener for creating a new comment
document.querySelector('#comment-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const postId = window.location.pathname.split('/').pop();
  const commentText = event.target.commentContent.value.trim();

  if (commentText) {
    const newComment = await createComment(postId, commentText);
    if (newComment) {
      appendComment(newComment);
      event.target.commentContent.value = ''; // Clear the comment box
      console.log('New comment created:', newComment);
    } else {
      console.error('Failed to create comment.');
      alert('Failed to create comment. Please try again.');
    }
  } else {
    alert('Comment cannot be empty.');
  }
});
