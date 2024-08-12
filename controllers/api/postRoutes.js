const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const postsData = await Post.findAll({
      include: [
        { model: User, attributes: ['userName'] },
        {
          model: Comment,
          include: [{ model: User, attributes: ['userName'] }],
        },
      ],
      order: [['createdAt', 'DESC']], // Order posts by creation date
    });

    const posts = postsData.map(post => post.get({ plain: true }));

    console.log(posts); // Check the structure here

    res.render('homepage', { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get current user
router.get('/current', withAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: ['id', 'userName', 'email'], // Add other attributes as needed
    });
    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get posts by user ID
router.get('/user/:id', withAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    const postData = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['userName'],
        },
      ],
      order: [['createdAt', 'DESC']], // Order posts by creation date
    });

    const posts = postData.map(post => post.get({ plain: true }));
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// // edit a single post by id

router.get('/editpost/:id', withAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Render the edit page with the post data
    res.render('editpost', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post('/user/:id/post', withAuth, async (req, res) => {
  try {
    const { title, description } = req.body; // Extract title and description from request body

    const newPost = await Post.create({
      title,
      description,
      userId: req.params.id, // Use the user ID from the session
    });

    const postData = await Post.findByPk(newPost.id, {
      include: [{ model: User, attributes: ['userName'] }],
    });
    console.log('Created post data:', postData); // Log the created post data
    res.status(200).json(postData); // Respond with the created post
  } catch (err) {
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
router.put('/user/:id/post/:id', withAuth, async (req, res) => {
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
