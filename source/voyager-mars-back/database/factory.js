'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint('App/Models/Company', async ( faker) => {
  return {
    code: faker.word({ length: 4 }),
    name: faker.name(),
    description: faker.sentence({ words: 5 }),
    email: faker.email(),
    plateau_size: 'XXS',
  };
});

Factory.blueprint('App/Models/Rover', async ( faker) => {
  return {
    code: faker.word({ length: 4 }),
    name: faker.name(),
    description: faker.sentence({ words: 5 }),
    location: faker.word({ length: 3 }),
    coordinate_x: faker.integer({ min: 0, max: 750 }),
    coordinate_y: faker.integer({ min: 0, max: 450 }),
    direction: 'N',
  };
});