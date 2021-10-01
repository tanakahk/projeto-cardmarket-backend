const { Model } = require("objection")
const knex = require("../db/knex")

Model.knex(knex)

module.exports = class Sr extends Model {
  static get tableName() {
    return "srs"
  }

  static get idColumn() {
    return "id"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["price"],
      properties: {
        id: { type: "integer" },
        created_at: { type: "timestamp" },
        updated_at: { type: "timestamp" },
        deleted_at: { type: "timestamp" },
        price: { type: "integer" },
      },
    }
  }

  static get relationMappings() {
    const User = require("./User")
    const UserSr = require("./UserSr")
    const SrImage = require("./SrImage")
    const SrStatus = require("./SrStatus")

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "srs.id",
          through: {
            modelClass: UserSr,
            from: "users_srs.sr_id",
            to: "users_srs.user_id",
          },
          to: "users.id"
        },
      },
      images: {
        relation: Model.HasOneRelation,
        modelClass: SrImage,
        join: {
          from: "srs.id",
          to: "sr_images.sr_id",
        },
      },
      status: {
        relation: Model.HasOneRelation,
        modelClass: SrStatus,
        join: {
          from: "srs.id",
          to: "sr_status.sr_id",
        },
      },
    }
  }
}
