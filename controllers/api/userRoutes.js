const { User } = require('../models');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const userController = {
  // Route to create a new user
  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userName, email, password } = req.body;

      // Check if user with the same email exists
      let existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
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
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        res.status(200).json(newUser);
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user.' });
    }
  },

  // Route to log in an existing user
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        res.status(200).json({ user: userData, message: 'You are now logged in!' });
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to log in.' });
    }
  },

  // Route to log out an existing user
  logout: (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  }
};

module.exports = userController;
