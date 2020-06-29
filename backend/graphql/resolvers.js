const { User } = require('../models');
const { addUser, loginUser, getUsers, getUser } = require('../handlers/userHandler');
const { addTask, deleteTask, updateTask, getTask, uploadFile, readFile } = require('../handlers/taskHandler');

module.exports = {
    Query: {
        getUsers,
        getUser,
        getTask,
        readFile,
    },

    Mutation: {
        addUser,
        addTask,
        deleteTask,
        updateTask,
        loginUser,
        uploadFile,
    }
}