const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class SrStatus extends Model {
  static get tableName() {
    return "sr_status"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [ "atk", "hp", "def", "cost", "sp", "cooldown", "sr_id" ],
      properties: {
        id: { type: "integer" },
        atk: { type: "integer" },
        hp: { type: "integer" },
        def: { type: "integer" },
        cost: { type: "integer" },
        sp: { type: "integer" },
        cooldown: { type: "integer" },
        sr_id: { type: "integer" },
      },
    }
  }
}
