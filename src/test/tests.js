const request = require("supertest")
const knex = require("../db/knex")
const expect = require("chai").expect
const server = require("../server")

const TEST_TIMEOUT = 5000

const user = {
  id: "",
  username: "Tanaka",
  password: "senha secreta 2020",
  token: "",
}

// miscellaneous (variáveis diversas)
const misc = {
  sr_id: "6100560",
  store_pg: "5",
  store_pg_negative: 0,
  sr_id_8_digits: "",
  sr_id_6_digits: "",
  sr_id_init_on_700: "",
}

if (misc) {
  // transforma o store_pg em um número negativo
  misc.store_pg_negative = misc.store_pg - (2 * misc.store_pg)

  // transforma o sr_id em um id errado de 8 dígitos
  misc.sr_id_8_digits = misc.sr_id_8_digits.concat(`${misc.sr_id}`, "0")

  // transforma o sr_id em um id errado de 6 dígitos
  misc.sr_id_6_digits = misc.sr_id
  misc.sr_id_6_digits = misc.sr_id_6_digits.split("", 6)
  misc.sr_id_6_digits = misc.sr_id_6_digits.join("")

  // transforma o sr_id em um id errado q começa com 700
  temp_sr_id = misc.sr_id
  temp_sr_id = temp_sr_id.slice(3)
  misc.sr_id_init_on_700 = misc.sr_id_init_on_700.concat("700", temp_sr_id)
}

const init = () => {

  describe("Signup", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it("Signup", (done) => {
      request(server)
        .post("/v1/signup")
        .send({ username: user.username, password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result.username).equal(user.username)
            expect(res.body.result.id).not.equal("")
            expect(res.body.result.token).not.equal("")
            user.id = res.body.result.id
            user.token = res.body.result.token
            done()
          } catch (err) {
            done(err)
          }

        })
    })

    it("Signup - No Username", (done) => {
      request(server)
        .post("/v1/signup")
        .send({ password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("NO_USERNAME")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Signup - No Password", (done) => {
      request(server)
        .post("/v1/signup")
        .send({ username: user.username })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("NO_PASSWORD")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Signup - User Exists", (done) => {
      request(server)
        .post("/v1/signup")
        .send({ username: user.username, password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("USER_EXISTS")
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("Login", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it("Login", (done) => {
      request(server)
        .post("/v1/login")
        .send({ username: user.username, password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result.id).not.equal("")
            expect(res.body.result.token).not.equal("")
            expect(res.body.result.username).equal(user.username)
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Login - No Username", (done) => {
      request(server)
        .post("/v1/login")
        .send({ password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("NO_USERNAME")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Login - No Password", (done) => {
      request(server)
        .post("/v1/login")
        .send({ username: user.username })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("NO_PASSWORD")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Login - User Not Found", (done) => {
      request(server)
        .post("/v1/login")
        .send({ username: 'user.username', password: user.password })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("USER_NOT_FOUND")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Login - Wrong Password", (done) => {
      request(server)
        .post("/v1/login")
        .send({ username: user.username, password: 'user.password' })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            expect(res.body.status).equal("WRONG_PASSWORD")
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("Store", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it("Store", (done) => {
      request(server)
        .get("/v1/store")
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result).not.equal("")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`Store Page ${misc.store_pg}`, (done) => {
      request(server)
        .get(`/v1/store?page=${misc.store_pg}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result).not.equal("")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`Store Page ${misc.store_pg_negative}`, (done) => {
      request(server)
        .get(`/v1/store?page=${misc.store_pg_negative}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Número negativo é inválido")
            expect(res.body.result).not.equal("")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("Store - Without Token", (done) => {
      request(server)
        .get("/v1/store")
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("SR Info", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it("SR Info", (done) => {
      request(server)
        .get(`/v1/sr_info/${misc.sr_id}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result).not.equal("")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`SR Info - Wrong ID (${misc.sr_id_8_digits.length} digits)`, (done) => {
      request(server)
        .get(`/v1/sr_info/${misc.sr_id_8_digits}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("O ID está incorreto")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`SR Info - Wrong ID (${misc.sr_id_6_digits.length} digits)`, (done) => {
      request(server)
        .get(`/v1/sr_info/${misc.sr_id_6_digits}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("O ID está incorreto")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`SR Info - Wrong ID (Init with 700)`, (done) => {
      request(server)
        .get(`/v1/sr_info/${misc.sr_id_init_on_700}`)
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("O ID está incorreto")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("SR Info - Without Token", (done) => {
      request(server)
        .get(`/v1/sr_info/${misc.sr_id}`)
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("TRX SR - Buy", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it(`TRX SR - Buy ${misc.sr_id}`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("Skill comprada")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (Miss Username)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ sr_id: misc.sr_id, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("User não passou um username")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (Miss sr_id)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("User não passou um sr_id")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (User not found)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: 'user.username', sr_id: misc.sr_id, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Usuário inexistente")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (Skill not found)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id_8_digits, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Skill inexistente")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (invalid trx_type)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 2 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("trx_type inválido / inexistente. Mande 1 para comprar ou 0 para vender.")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Buy ${misc.sr_id} (Without token)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 2 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("TRX SR - Sell", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it(`TRX SR - Sell ${misc.sr_id}`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 0 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("Skill vendida")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (Miss Username)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ sr_id: misc.sr_id, trx_type: 0 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("User não passou um username")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (Miss sr_id)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, trx_type: 0 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("User não passou um sr_id")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (User not found)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: 'user.username', sr_id: misc.sr_id, trx_type: 0 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Usuário inexistente")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (Skill not found)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id_8_digits, trx_type: 0 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Skill inexistente")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (invalid trx_type)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 2 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("trx_type inválido / inexistente. Mande 1 para comprar ou 0 para vender.")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - Sell ${misc.sr_id} (Without token)`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 2 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
  describe("My SR", function () {
    this.timeout(TEST_TIMEOUT)

    before((done) => {
      knex.migrate
        .latest()
        .then(() => knex.seed.run())
        .then(() => done())
        .catch((err) => console.log(err))
    })

    it("My SR - User not found", (done) => {
      request(server)
        .get('/v1/my_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({})
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Usuário não encontrado")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("My SR - Invalid user", (done) => {
      request(server)
        .get('/v1/my_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: 'user.username' })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Usuário inválido")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("My SR (User never bought before)", (done) => {
      request(server)
        .get('/v1/my_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username })
        .then((res) => {
          try {
            expect(res.statusCode).equal(400)
            expect(res.body.status).equal("Usuário nunca comprou aqui")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it(`TRX SR - buy before show SR`, (done) => {
      request(server)
        .post('/v1/trx_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username, sr_id: misc.sr_id, trx_type: 1 })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("Skill comprada")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("My SR", (done) => {
      request(server)
        .get('/v1/my_sr')
        .set({ "authorization": `Bearer ${user.token}` })
        .send({ username: user.username })
        .then((res) => {
          try {
            expect(res.statusCode).equal(200)
            expect(res.body.status).equal("OK")
            expect(res.body.result).not.equal("")
            done()
          } catch (err) {
            done(err)
          }
        })
    })

    it("My SR - Without token", (done) => {
      request(server)
        .get('/v1/my_sr')
        .send({ username: user.username })
        .then((res) => {
          try {
            expect(res.statusCode).equal(401)
            done()
          } catch (err) {
            done(err)
          }
        })
    })
  })
}

init()
