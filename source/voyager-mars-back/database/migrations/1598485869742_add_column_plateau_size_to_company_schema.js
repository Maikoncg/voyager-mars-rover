'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddColumnPlateauSizeToCompanySchema extends Schema {
  up () {
    this.table('companies', (table) => {
      table.string('plateau_size', 3).notNullable().defaultTo('XL');
    })
  }

  down () {
    this.table('companies', (table) => {
      table.dropColumn('plateau_size');
    })
  }
};

module.exports = AddColumnPlateauSizeToCompanySchema;
