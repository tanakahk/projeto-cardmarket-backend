const { createdAt, updatedAt, foreign } = require("../helpers");

exports.up = function (knex) {
  return knex.schema
    // users
    .createTable("users", function (table) {
      table.increments("id")
      createdAt(knex, table)
      updatedAt(knex, table)
      table.timestamp("deleted_at")
      table.string("username", 20).notNullable()
      table.string("password", 255).notNullable()
    })


};

exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
};
