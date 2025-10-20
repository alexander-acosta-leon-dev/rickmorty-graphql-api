jest.mock('../services/redisService', () => ({
  redisCache: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
  },
  connectRedis: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { schema } from '../graphql';
import { sequelize } from '../db/sequelize';
import { Character } from '../models/character';

let app: express.Application;
let server: ApolloServer;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed one or two characters manually
  await Character.bulkCreate([
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      originName: 'Earth (C-137)',
      image: 'rick.png',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      originName: 'Earth (Replacement Dimension)',
      image: 'morty.png',
    },
  ]);

  app = express();
  server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });
});

afterAll(async () => {
  await sequelize.close();
  if (server) {
    await server.stop();
  }
});

describe('Character GraphQL Query', () => {
  it('should fetch all characters', async () => {
    const query = `
      query {
        characters {
          id
          name
          status
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters.length).toBe(2);
    expect(res.body.data.characters[0]).toHaveProperty('name');
  });

  it('should filter characters by name', async () => {
    const query = `
      query {
        characters(filter: { name: "Rick" }) {
          id
          name
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters.length).toBe(1);
    expect(res.body.data.characters[0].name).toBe('Rick Sanchez');
  });

  it('should return empty array when no match', async () => {
    const query = `
      query {
        characters(filter: { name: "Nonexistent" }) {
          id
          name
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters).toHaveLength(0);
  });

  it('should filter characters by status', async () => {
    const query = `
      query {
        characters(filter: { status: "Alive" }) {
          id
          name
          status
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters.length).toBe(2);
    expect(res.body.data.characters.every((char: any) => char.status === 'Alive')).toBe(true);
  });

  it('should filter characters by species', async () => {
    const query = `
      query {
        characters(filter: { species: "Human" }) {
          id
          name
          species
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters.length).toBe(2);
    expect(res.body.data.characters.every((char: any) => char.species === 'Human')).toBe(true);
  });

  it('should filter characters by gender', async () => {
    const query = `
      query {
        characters(filter: { gender: "Male" }) {
          id
          name
          gender
        }
      }
    `;
    const res = await request(app).post('/graphql').send({ query });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.characters.length).toBe(2);
    expect(res.body.data.characters.every((char: any) => char.gender === 'Male')).toBe(true);
  });
});
