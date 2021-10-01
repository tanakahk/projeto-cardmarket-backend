const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class Billing extends Model {
  static get tableName() {
    return "billings"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [ "trx_type", "amount", "user_id", "user_sr_id" ],
      properties: {
        id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: "timestamp" },
        trx_type: { type: "integer" },
        amount: { type: "integer" },
        user_id: { type: "integer" },
        user_sr_id: { type: "integer" },
      },
    }
  }
}
