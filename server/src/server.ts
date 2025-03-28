import express from 'express';
import path from 'path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (_req, res) =>
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  );
}

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}/graphql`));
});

