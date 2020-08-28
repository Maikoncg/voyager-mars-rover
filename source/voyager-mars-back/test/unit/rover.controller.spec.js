'use strict';

const Factory = use('Factory');
const HttpStatus = use('http-status-codes');

const Suite = use('Test/Suite')('Rover');

const Rover = use('App/Models/Rover');

const { test, trait, beforeEach, afterEach } = Suite;

trait('Test/ApiClient');

let rover1;
let rover2;

beforeEach(async () => {
  rover1 = await Factory.model('App/Models/Rover').create();
  rover2 = await Factory.model('App/Models/Rover').create();
});

afterEach(async () => {
  await Rover.query().delete();
});

test('list rovers', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/rovers')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
});

test('list rovers - default order by name', async ({ client, assert }) => {
  //arrange
  rover1.name = 'Moon rover';
  rover2.name = 'Mars rover';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - default order by name - desc', async ({ client, assert }) => {
  //arrange
  rover1.name = 'B';
  rover2.name = 'A';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?descending=desc')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover1.id);
  assert.equal(response.body[1].id, rover2.id);
});

test('list rovers - order by location', async ({ client, assert }) => {
  //arrange
  rover1.location = 'Moon';
  rover2.location = 'Mars';
  await rover1.save();
  await rover2.save();

  //act
  const response = await client
    .get('api/rovers?sortBy=location')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 2);
  assert.equal(response.body[0].id, rover2.id);
  assert.equal(response.body[1].id, rover1.id);
});

test('list rovers - search', async ({ client, assert }) => {
  //arrange
  rover1.name = 'MOON-N1';
  await rover1.save();

  //act
  const response = await client
    .get('api/rovers?search=MOON-N1')
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].id, rover1.id);
});

test('list rovers - search by company_id', async ({ client, assert }) => {
  const company = await Factory.model('App/Models/Company').create();

  rover1.company_id = company.id;
  await rover1.save();

  const response = await client
    .get(`api/rovers?company_id=${company.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].id, rover1.id);
});

test('create rover - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/rovers/create')
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('create rover - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get('api/rovers/create')
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('create rover', async ({ client, assert }) => {
  const company = await Factory.model('App/Models/Company').create();

  //arrange
  const data = {
    code: 'MARS-N2',
    name: 'Mars rover',
    description: 'Curiosity Rover Finds an Ancient Oasis on Mars.',
    location: 'Mars',
    coordinate_x: 0,
    coordinate_y: 0,
    direction: 'N',
    company_id: company.id,
  };

  //act
  const response = await client
    .post('api/rovers')
    .send(data)
    .end();
    
  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.code, data.code);
  assert.equal(response.body.name, data.name);
  assert.equal(response.body.description, data.description);
  assert.equal(response.body.location, data.location);
  assert.equal(response.body.coordinate_x, data.coordinate_x);
  assert.equal(response.body.coordinate_y, data.coordinate_y);
  assert.equal(response.body.direction, data.direction);

  assert.exists(response.body.id);
  assert.exists(response.body.created_at);
  assert.exists(response.body.updated_at);
});

test('create rover - code exists', async ({ client, assert }) => {
  const company = await Factory.model('App/Models/Company').create();

  //arrange
  const data = {
    code: rover1.code,
    name: 'Mars rover',
    description: 'Curiosity Rover Finds an Ancient Oasis on Mars.',
    location: 'Mars',
    coordinate_x: 0,
    coordinate_y: 0,
    direction: 'N',
    company_id: company.id,
  };

  //act
  const response = await client
    .post('api/rovers')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.CONFLICT);
});

test('show rover', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/rovers/${rover2.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);
  assert.equal(response.body.id, rover2.id);
  assert.equal(response.body.code, rover2.code);
  assert.equal(response.body.name, rover2.name);
  assert.equal(response.body.description, rover2.description);
  assert.equal(response.body.location, rover2.location);
  assert.equal(response.body.coordinate_x, rover2.coordinate_x);
  assert.equal(response.body.coordinate_y, rover2.coordinate_y);
  assert.equal(response.body.direction, rover2.direction);
  assert.equal(response.body.created_at, rover2.created_at);
  assert.equal(response.body.updated_at, rover2.updated_at);
});

test('edit rover - not implemented', async ({ client, assert }) => {
  //act
  const response = await client
    .get(`api/rovers/${rover2.id}/edit`)
    .end();

  //assert
  response.assertStatus(HttpStatus.METHOD_NOT_ALLOWED);
});

test('update rover', async ({ client, assert }) => {
  const company = await Factory.model('App/Models/Company').create();

  //arrange
  const data = {
    code: rover1.code,
    name: 'Mars rover',
    description: 'Curiosity Rover Finds an Ancient Oasis on Mars.',
    location: 'Mars',
    coordinate_x: 0,
    coordinate_y: 0,
    direction: 'N',
    company_id: company.id,
  };

  //act
  const response = await client
    .put(`api/rovers/${rover1.id}`)
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedRover = await Rover.query().where({ id: rover1.id }).first();

  assert.equal(updatedRover.id, rover1.id);
  assert.equal(updatedRover.code, data.code);
  assert.equal(updatedRover.name, data.name);
  assert.equal(updatedRover.description, data.description);
  assert.equal(updatedRover.location, data.location);
  assert.equal(updatedRover.coordinate_x, data.coordinate_x);
  assert.equal(updatedRover.coordinate_y, data.coordinate_y);
  assert.equal(updatedRover.direction, data.direction);
});

test('update rover - invalid id', async ({ client, assert }) => {
  const company = await Factory.model('App/Models/Company').create();

  //arrange
  const data = {
    code: 'MARS-N2',
    name: 'Mars rover',
    description: 'Curiosity Rover Finds an Ancient Oasis on Mars.',
    location: 'Mars',
    coordinate_x: 0,
    coordinate_y: 0,
    direction: 'N',
    company_id: company.id,
  };

  //act
  const response = await client
    .put('api/rovers/99999999')
    .send(data)
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});

test('delete rover', async ({ client, assert }) => {
  //act
  const response = await client
    .delete(`api/rovers/${rover1.id}`)
    .end();

  //assert
  response.assertStatus(HttpStatus.OK);

  const updatedRover = await Rover.query().where({ id: rover1.id }).first();

  assert.notExists(updatedRover);
});

test('delete rover - invalid id', async ({ client, assert }) => {
  //act
  const response = await client
    .delete('api/rovers/99999999')
    .end();

  //assert
  response.assertStatus(HttpStatus.BAD_REQUEST);
});