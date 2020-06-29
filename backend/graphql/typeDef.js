const { gql }  = require('apollo-server-express');

module.exports = gql`
    type User {
        user_id: ID,
        user_name: String,
        tasks: [Task]
    }

    type Task {
        task_id: ID,
        task_title: String,
        created_at: String,
        description: String,
        status: String
    }

    type Authentication {
        user: User,
        access_token: String
    }

    type Query {
        getUsers: [User],
        getUser: User,
        getTask(task_id: ID): Task,
        readFile(filename: String!): ReadFile,
    }
    
    type ReadFile{
        url: String,
    }

    type Mutation {
        addUser(user_name: String, password: String): MutationResponse,
        addTask(task_title: String, description: String): MutationResponse,
        deleteTask(task_id:ID): MutationResponse,
        updateTask(task: taskInput): Task,
        loginUser(user_name: String, password: String): Authentication,
        uploadFile(file: Upload!, filename: String): MutationResponse
    }

    input taskInput{
        task_title: String,
        status: String,
        task_id: ID,
        description: String,
    }

    type MutationResponse {
        status: String!,
        message: String,
        error: String,
    }
`;