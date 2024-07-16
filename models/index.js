const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, {
  foreignKey: 'user_userName',
  sourceKey: 'userName',
  onDelete: 'CASCADE',
});

Post.belongsTo(User, {
  foreignKey: 'user_userName',
  targetKey: 'userName',
});

User.hasMany(Comment, {
  foreignKey: 'user_userName',
  sourceKey: 'userName',
  onDelete: 'CASCADE',
});

Comment.belongsTo(User, {
  foreignKey: 'user_userName',
  targetKey: 'userName',
  onDelete: 'CASCADE',
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

module.exports = { User, Post, Comment };
