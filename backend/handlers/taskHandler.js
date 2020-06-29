const uuid = require('uuid');
const Joi = require('@hapi/joi');
const path = require('path');
const DataUri = require('datauri/sync');

const Bookshelf = require('../dbConfig');
const { Task } = require('../models');
const { taskSchema } = require('../JoiSchema');
const { createWriteStream } = require('fs');

exports.addTask = async (parent, args, context) => {
    try{
        if(!context.user_id){
            throw new Error("You should be logged in", 401);
        }

        const value = taskSchema.validate({
            ...args
        });

        if(value.error){
            let err = new Error(value.error.message);
            err.code = 400;
            throw err;
        }

        const id = uuid.v4();
        const created_at = new Date().toISOString();

        await Task.forge({
            task_id: id,
            task_title: args.task_title,
            created_at,
            description: args.description,
            user_id: context.user_id,
            status: "READY"
        }).save();

        return {
            status: 'SUCCESS',
            message: "Task Added"
        }
    }   
    catch(err){
        return err;
    }
}

exports.deleteTask = async (parent, args) => {
    try{
        await Task.where("task_id", args.task_id).destroy();

        return {
            status: "SUCCESS",
            message: "Task Deleted",
        }
    }
    catch(err){
        return {
            status: "ERROR",
            error: err
        }
    }
}

exports.updateTask = async (parent, args, context) => {
    try{
        if(!context.user_id){
            const err = new Error("You should be logged in",);
            err.code = 401;
            throw err;
        }

        const task = await Task.where('task_id', args.task.task_id).save({
            ...args.task,
        }, {patch: true});

        return task.toJSON();
    }
    catch(err){
        return err;
    }
}

exports.getTask = async (parent, args, context) => {
    try{
        if(!context.user_id){
            const err = new Error("You should be logged in",);
            err.code = 401;
            throw err;
        }

        const task = await Task.where('task_id', args.task_id).fetch();

        return task.toJSON();
    }
    catch(err){
        return err;
    }
}

exports.uploadFile = async (parent, args) => {
    try{
        const { createReadStream } = await args.file;

        await new Promise( (res, err) => {
            createReadStream().pipe(createWriteStream(path.join(__dirname, '../images', args.filename + '.png'))).on('close', res);
        });

        return {
            status: "SUCCESS",
            message: "File Uploaded"
        }
    }
    catch(err){
        console.log(err);
        return err;
    }
}

exports.readFile = async (parent, args) => {
    try{
        const uri = DataUri(path.join(__dirname, '../images', args.filename + '.png'));

        return {
            url: uri.content
        }
    }
    catch(err){
        return err.message;
    }
}