const jwt = require('jsonwebtoken');
const fs = require('fs');

const private_key = fs.readFileSync(__dirname + '/../.config/jwt/private.pem');
const public_key = fs.readFileSync(__dirname + '/../.config/jwt/public.pem');

exports.generateToken = (data) => {
    const token = jwt.sign(data, {key: private_key, passphrase: 'password'}, { algorithm: 'RS256', expiresIn: '1h'});
    return token;
}

exports.verifyToken = (token) => {
    const decoded = jwt.verify(token, public_key);
    
    return decoded;
}