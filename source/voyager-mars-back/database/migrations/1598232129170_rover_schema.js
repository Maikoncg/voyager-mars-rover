'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RoverSchema extends Schema {
  up () {
    this.create('rovers', (table) => {
      table.increments();
      table.string('code', 255).notNullable().defaultTo('');
      table.string('name', 255).notNullable().defaultTo('');
      table.string('description', 255)
      table.string('location', 255)
      table.integer('coordinate_x', 11).notNullable().defaultTo(0);
      table.integer('coordinate_y', 11).notNullable().defaultTo(0);
      table.timestamps();
    });
  }

  down () {
    this.drop('rovers');
  }
};

module.exports = RoverSchema;
