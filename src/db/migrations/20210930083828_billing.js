const { createdAt, updatedAt, foreign } = require("../helpers");

exports.up = function (knex) {
  return knex.schema
    // billings
    .createTable("billings", function (table) {
      table.increments("id")
      createdAt(knex, table)
      updatedAt(knex, table)
      table.timestamp("deleted_at")
      table.specificType("trx_type", "bit(1)").notNullable()
      table.integer("amount").notNullable()
      // foreign users
      foreign(table, "user_id", "users")
      // foreign users_srs
      foreign(table, "user_sr_id", "users_srs")
    })
};

exports.down = function (knex) {
  return knex.schema
    .table("billings", function (table) {
      table.dropForeign("user_id")
      table.dropForeign("user_sr_id")
    })
    .dropTable("billings")
};
