if (!process.env.NODE_ENV) {
  require("dotenv").config({ path: `${__dirname}/../../.env` })
}

console.log("[DB_HOST]...", process.env.DB_HOST)

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
  migrations: {
    directory: `${__dirname}/migrations`,
    schemaName: process.env.DB_DATABASE,
    tableName: "knex_migrations",
  },
}

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  config.seeds = {
    directory: `${__dirname}/seeds`,
  }
}

if (process.env.NODE_ENV === "test") {
  config.client = "sqlite3"
  config.connection = ":memory:"
  config.useNullAsDefault = true
  config.connection.database = null
  config.migrations.schemaName = null
}

module.exports = config
