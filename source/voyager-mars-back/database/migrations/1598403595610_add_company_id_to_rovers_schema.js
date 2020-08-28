'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddCompanyIdToRoversSchema extends Schema {
  up () {
    this.table('rovers', (table) => {
      table.integer('company_id').unsigned().references('id').inTable('companies');
    });
  }
  
  down () {
    this.table('rovers', (table) => {
      table.dropForeign('company_id');
      table.dropColumn('company_id');
    });
  }
};

module.exports = AddCompanyIdToRoversSchema;
