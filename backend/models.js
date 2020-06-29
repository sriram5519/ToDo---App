const bookshelf = require('./dbConfig');

const Task = bookshelf.Model.extend({
    tableName: 'tasks',
});

const User = bookshelf.Model.extend({
    tableName: 'users',

    tasks() {
        return this.hasMany(Task, "user_id", "user_id");
    }
});

exports.Task = Task;
exports.User = User;