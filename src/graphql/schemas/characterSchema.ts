import { gql } from 'apollo-server-express';

export const characterTypeDefs = gql`
  type Character {
    id: Int!
    name: String
    status: String
    species: String
    gender: String
    originName: String
    image: String
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    gender: String
    originName: String
  }

  type Query {
    characters(filter: CharacterFilter): [Character]
  }
`;
