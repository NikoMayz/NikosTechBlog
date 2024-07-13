const router = require('express').Router();
const { Comment } = require('../../models');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll();
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single comment by id
router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findByPk(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new comment
router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a comment by id
router.delete('/:id', async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
