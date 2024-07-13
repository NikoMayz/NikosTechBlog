const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

User.hasMany(Post, Comment, {        
    foreignKey: 'user_username',
    onDelete: 'CASCADE'
});

Post.belongsTo(User,{
    foreignKey: 'user_username'
});

Comment.belongsTo(Post,{
    foreignKey: 'user_username',
    onDelete: 'CASCADE'
});

Post.hasMany(Comment,{
 foreignKey: 'user_username',
    onDelete: 'CASCADE'
});

module.exports = { User, Post, Comment };