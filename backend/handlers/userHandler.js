const uuid = require('uuid');
const fs = require('fs');
const Bookshelf = require('../dbConfig');
const Joi = require('@hapi/joi');

const { User } = require('../models');
const { hashPassword, verifyHash } = require('../utils/hash');
const { generateToken } = require('../utils/token');
const { userSchema } = require('../JoiSchema');

exports.addUser = async (parent, args) => {
    const id = uuid.v4(args.user_name);
    
    try{
        userSchema.validate({
            ...args
        });

        const password = await hashPassword(args.password);
        await User.forge({
            user_id: id,
            user_name: args.user_name,
            password: password,
        }).save();

        return {
            status: "SUCCESS",
            message: "User registered successfully"
        }
    }
    catch(err){
        return {
            status: "ERROR",
            error: err
        }
    }
}

exports.loginUser = async (parent, args) => {
    try{
        const value = userSchema.validate({
            ...args
        });
        if(value.error){
            const err = new Error(value.error.message);
            err.code = 403;

            throw err;
        }

        const user = await new User({user_name: args.user_name}).fetch();
        
        const result = user.toJSON();

        const isValidPassword = await verifyHash(args.password, result.password);

        if(isValidPassword){
            const data = {
                user_name: args.user_name,
                user_id: result.user_id
            }

            const token = generateToken(data);

            const res = {
                user: result,
                access_token: token
            }

            return res;
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        return err;
    }
}

exports.getUsers = async () => {
    try{
        const Users = Bookshelf.Collection.extend({
            model: User
        })
        const res = await Users.forge().fetch();
        
        return res.toJSON();
    }
    catch(err){
        return err;
    }
}

exports.getUser = async (parent, args, context) => {
    try{
        if(!context.user_id){
            throw new Error("You Should be logged in");
        }
        const user = await new User({user_id: context.user_id}).fetch({withRelated: 'tasks'});
        return user.toJSON();
    }
    catch(err){
        return err;
    }
}

