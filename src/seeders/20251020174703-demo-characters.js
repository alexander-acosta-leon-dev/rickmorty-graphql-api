'use strict';

const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Fetch first 15 characters from Rick and Morty API
      const response = await axios.get('https://rickandmortyapi.com/api/character?page=1');
      const characters = response.data.results.slice(0, 15);

      const charactersData = characters.map((char) => ({
        id: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        gender: char.gender,
        origin_name: char.origin.name,
        image: char.image,
      }));

      await queryInterface.bulkInsert('characters', charactersData, {});
      console.log('[INFO] Successfully seeded 15 Rick & Morty characters!');
    } catch (error) {
      console.error('[ERROR] Error seeding characters:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('characters', null, {});
    console.log('[INFO] Successfully removed all character seed data!');
  },
};
