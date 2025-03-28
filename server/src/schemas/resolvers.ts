import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('No user found');

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError('Incorrect credentials');

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (_parent: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { book }: any, context: any) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (_parent: any, { bookId }: any, context: any) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;
