const router = require('express').Router();
const { Post, Comment, User } = require('../../models');

// Get a single post with comments
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['userName'] },
        {
          model: Comment,
          include: [{ model: User, attributes: ['userName'] }]
        }
      ]
    });

    if (!postData) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = postData.get({ plain: true });

    res.render('post', post); // Render post.handlebars with the post data
  } catch (err) {
    res.status(500).json(err);
  }
});


// Post a new comment
router.post('/post/:id/comment', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      return res.status(401).json({ message: 'You must be logged in to comment' });
    }

    const { commentContent } = req.body;

    const newComment = await Comment.create({
      content: commentContent,
      postId: req.params.id,
      userId: req.session.user_id, // Use the user ID from the session
    });

    const commentData = await Comment.findByPk(newComment.id, {
      include: [{ model: User, attributes: ['userName'] }],
    });

    res.status(200).json(commentData); // Respond with the created comment
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
