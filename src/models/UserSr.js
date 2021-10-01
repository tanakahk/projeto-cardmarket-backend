const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class UserSr extends Model {
  static get tableName() {
    return "users_srs"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "sr_id"],
      properties: {
        id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: "timestamp" },
        user_id: { type: "integer" },
        sr_id: { type: "integer" },
      },
    }
  }
}
