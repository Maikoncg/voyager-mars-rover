'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddColumnDirectionToRoversSchema extends Schema {
  up () {
    this.table('rovers', (table) => {
      table.string('direction', 1).notNullable();
    });
  }

  down () {
    this.table('rovers', (table) => {
      table.dropColumn('direction');
    });
  }
};

module.exports = AddColumnDirectionToRoversSchema;
