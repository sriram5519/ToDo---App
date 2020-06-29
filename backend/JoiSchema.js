const Joi = require('@hapi/joi');

exports.userSchema = Joi.object({
    user_name: Joi.string().alphanum().min(5).max(20).required(),
    password: Joi.string().alphanum().min(8).max(25).required()
});

exports.taskSchema = Joi.object({
    task_title: Joi.string().min(5).max(30).required(),
    description: Joi.string().min(5).max(100)
});