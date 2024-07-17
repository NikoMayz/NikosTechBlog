const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['userName'] }] // Include username in the post data
    });

    if (!postData || postData.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get posts by username
router.get('/posts/:userName', withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({ where: { userName: req.params.userName } });
    if (!userData) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }

    const postData = await Post.findAll({
      where: { userId: userData.id }, // Corrected to userId
      include: [{ model: User, attributes: ['userName'] }]
    });

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post('/posts', withAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.session.user_id; // Use the user_id from the session

    // Validate input
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    // Create the post
    const newPost = await Post.create({
      title,
      description,
      userId,
    });

    res.status(200).json(newPost);
  } catch (err) {
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(error => ({
        field: error.path,
        message: error.message,
      }));
      return res.status(400).json({ errors });
    }

    // Handle other errors
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});


// Update a post
router.put('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    if (postData.userId !== req.session.user_id) { // Corrected to userId
      res.status(403).json({ message: 'You are not authorized to update this post!' });
      return;
    }

    const updatedPost = await postData.update(req.body);
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post
router.delete('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    if (postData.userId !== req.session.user_id) { // Corrected to userId
      res.status(403).json({ message: 'You are not authorized to delete this post!' });
      return;
    }

    await postData.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
