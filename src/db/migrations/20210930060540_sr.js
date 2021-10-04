const { createdAt, updatedAt, foreign } = require("../helpers");

exports.up = function (knex) {
  return knex.schema
    // srs
    .createTable("srs", function (table) {
      table.increments("id")
      createdAt(knex, table)
      updatedAt(knex, table)
      table.timestamp("deleted_at")
      table.specificType("price", "smallint(5)").notNullable()
      table.specificType("sr_id", "mediumint(7)").notNullable()
    })
    // users_srs
    .createTable("users_srs", function (table) {
      table.increments("id")
      createdAt(knex, table)
      updatedAt(knex, table)
      table.timestamp("deleted_at")
      // foreign user MM
      foreign(table, "user_id", "users")
      // foreign sr MM
      foreign(table, "sr_id", "srs")
    })
    // sr_images
    .createTable("sr_images", function (table) {
      table.increments("id")
      table.string("url", 111).notNullable()
      // foreign sr
      foreign(table, "sr_id", "srs")
    })

    // sr_status
    .createTable("sr_status", function (table) {
      table.increments("id")
      table.specificType("atk", "tinyint(2)").notNullable()
      table.specificType("hp", "smallint(4)").notNullable()
      table.specificType("def", "tinyint(2)").notNullable()
      table.specificType("cost", "tinyint(2)").notNullable()
      table.specificType("sp", "tinyint(2)").notNullable()
      table.specificType("cooldown", "tinyint(2)").notNullable()
      // foreign sr
      foreign(table, "sr_id", "srs")
    })
};

exports.down = function (knex) {
  return knex.schema
    .table("sr_status", function (table) {
      table.dropForeign("sr_id")
    })
    .table("sr_images", function (table) {
      table.dropForeign("sr_id")
    })
    .table("users_srs", function (table) {
      table.dropForeign("user_id")
      table.dropForeign("sr_id")
    })
    .dropTable("sr_status")
    .dropTable("sr_images")
    .dropTable("users_srs")
    .dropTable("srs")
};
