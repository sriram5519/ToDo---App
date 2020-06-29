import { gql } from 'apollo-boost';

export const GET_USERS = gql`
    query {
        getUsers {
            user_name
            user_id
        }
    }
`;

export const ADD_USER = gql`
    mutation registerUser($user_name: String!, $password: String!){
        addUser(user_name: $user_name, password: $password){
            message
            status
            error
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($user_name: String!, $password: String!){
        loginUser(user_name: $user_name, password: $password){
            user{
                user_name
                user_id
            }
            access_token
        }
    }
`;

export const GET_USER_TASKS = gql`
    query{
        getUser{
            tasks{
                task_title
                created_at
                status
                description
                task_id
            }
        }
    }
`;

export const ADD_TASK = gql`
    mutation addTask($task_title: String, $description: String){
        addTask(task_title: $task_title, description: $description){
            message
            status
            error
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation updateTask($task: taskInput){
        updateTask(task: $task){
            task_id
            task_title
            description
            created_at
            status
        }
    }
`;

export const DELETE_TASK = gql`
    mutation deleteTask($task_id: ID){
        deleteTask(task_id: $task_id){
            status
            message
            error
        }
    }
`;

export const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!, $filename: String){
        uploadFile(file: $file, filename: $filename){
            status
            message
        }
    }
`;

export const READ_FILE = gql`
    query readFile($filename: String!){
        readFile(filename: $filename){
            url
        }
    }
`;