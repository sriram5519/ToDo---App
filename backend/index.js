const { ApolloServer } = require('apollo-server-express');
const { verifyToken } = require('./utils/token');

const express = require('express');
const cors = require('cors');

const typeDefs = require('./graphql/typeDef');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        
        if(token){
            try{
                const { user_id } = verifyToken(token);
        
                if(!user_id){
                    throw new Error("You must be logged in");
                }
                return {user_id};
            }
            catch(err){
                console.log(err);
            }
        }
    }
});
const app = express();
app.use(cors());

server.applyMiddleware({app, path: '/query'});

app.listen(5000, () => {
    console.log(`🚀 Server running at port 5000...`);
});