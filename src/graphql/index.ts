import { characterTypeDefs } from './schemas/characterSchema';
import { characterResolvers } from './resolvers/characterResolver';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const schema = makeExecutableSchema({
  typeDefs: [characterTypeDefs],
  resolvers: [characterResolvers],
});
