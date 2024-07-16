const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const userData = require('./users.json');
const postData = require('./posts.json');
const commentData = require('./comments.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    const posts = await Post.bulkCreate(postData, {
      returning: true,
    });

    const comments = await Comment.bulkCreate(commentData, {
      returning: true,
    });

    console.log('All seeds inserted successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
