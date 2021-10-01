const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class SrImage extends Model {
  static get tableName() {
    return "sr_images"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["url", "sr_id"],
      properties: {
        id: { type: "integer" },
        url: { type: "string", minLength: 1, maxLength: 111 },
        sr_id: { type: "integer" },
      },
    }
  }
}
