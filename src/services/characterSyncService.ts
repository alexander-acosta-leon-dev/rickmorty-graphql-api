import axios from 'axios';
import { Character } from '../models/character';

export async function syncCharacters() {
  console.log('[INFO] Syncing characters with Rick & Morty API...');
  try {
    const response = await axios.get('https://rickandmortyapi.com/api/character?page=1');
    const data = response.data.results.slice(0, 15);

    for (const character of data) {
      await Character.upsert({
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        originName: character.origin.name,
        image: character.image,
      });
    }

    console.log('[INFO] Character data synced successfully.');
  } catch (error) {
    console.error('[ERROR] Error syncing characters:', error);
  }
}
