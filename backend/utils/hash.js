const bcrypt = require('bcryptjs');

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err){
                    reject(err);
                }
                resolve(hash);
            })
        })
    })
}

exports.verifyHash = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if(err){
                reject(err);
            }
            resolve(res);
        })
    })
}