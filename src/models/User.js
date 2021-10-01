const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class User extends Model {
  static get tableName() {
    return "users"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "password"],
      properties: {
        id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: "timestamp" },
        username: { type: "string", minLength: 1, maxLength: 20 },
        password: { type: "string", minLength: 1, maxLength: 50 },
      },
    }
  }

  static get relationMappings() {
    const Sr = require("./Sr")
    const UserSr = require("./UserSr")
    const Billing = require("./Billing")

    return {
      srs: {
        relation: Model.ManyToManyRelation,
        modelClass: Sr,
        join: {
          from: "users.id",
          through: {
            modelClass: UserSr,
            from: "users_srs.user_id",
            to: "users_srs.sr_id",
          },
          to: "srs.id"
        },
      },
      billings: {
        relation: Model.HasManyRelation,
        modelClass: Billing,
        join: {
          from: "users.id",
          to: "billings.user_id",
        },
      },
    }
  }
}
