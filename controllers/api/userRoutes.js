const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const withAuth = require('../../utils/auth');

// Route to create a new user
router.post('/signup', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userName, email, password } = req.body;

    // Check if username is already taken
    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Session handling
    req.session.user_id = newUser.id;
    req.session.logged_in = true;
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Route to log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user by username
    const userData = await User.findOne({ where: { userName } });

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect username or password. Please try again.' });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect username or password. Please try again.' });
    }

    // Session handling
    req.session.user_id = userData.id;
    req.session.logged_in = true;
    res.status(200).json({ user: userData, message: 'You are now logged in!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Route to log out an existing user
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Route to check login status
router.get('/check-login', (req, res) => {
  res.json({ loggedIn: req.session.logged_in });
});

// Route to get the current user's details
router.get('/current', async (req, res) => {
  try {
    // Ensure `user_id` is being used correctly
    const user = await User.findByPk(req.session.user_id, {
      attributes: ['id', 'userName', 'email'], // Add other attributes as needed
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
});

module.exports = router;
