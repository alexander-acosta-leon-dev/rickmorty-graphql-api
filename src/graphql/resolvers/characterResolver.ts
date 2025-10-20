import { Op } from 'sequelize';
import { Character } from '../../models/character';
import { redisCache } from '../../services/redisService';
import { LogExecutionTime } from '../../utils/logExecutionTime';

interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  originName?: string;
}

interface CharacterArgs {
  filter?: CharacterFilter;
}

class CharacterService {
  @LogExecutionTime()
  async findCharacters(filter?: CharacterFilter): Promise<Character[]> {
    // Create cache key based on filter
    const cacheKey = `characters:${JSON.stringify(filter || {})}`;

    // Try to get from cache first
    const cachedResult = await redisCache.get(cacheKey);
    if (cachedResult) {
      console.log('[INFO] Cache HIT for:', cacheKey);
      return JSON.parse(cachedResult);
    }

    console.log('[INFO] Cache MISS - fetching from database for:', cacheKey);

    // Build database query
    const where: any = {};
    if (filter) {
      if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
      if (filter.status) where.status = { [Op.iLike]: filter.status };
      if (filter.species) where.species = { [Op.iLike]: filter.species };
      if (filter.gender) where.gender = { [Op.iLike]: filter.gender };
      if (filter.originName) where.originName = { [Op.iLike]: `%${filter.originName}%` };
    }

    // Fetch from database
    const characters = await Character.findAll({ where });

    // Cache the result for 5 minutes (300 seconds)
    await redisCache.set(cacheKey, JSON.stringify(characters), 300);

    return characters;
  }
}

// Create service instance
const characterService = new CharacterService();

// Export GraphQL resolvers
export const characterResolvers = {
  Query: {
    characters: async (_: any, { filter }: CharacterArgs) => {
      return await characterService.findCharacters(filter);
    },
  },
};
