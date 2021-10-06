const Billing = require("../../models/Billing");
const Sr = require("../../models/Sr");
const User = require("../../models/User");
const UserSr = require("../../models/UserSr");

const validaEntry = (req, user, sr, response) => {
  if (!req.username) {
    response.status = "User não passou um username"
    return false
  }
  if (!req.sr_id) {
    response.status = "User não passou um sr_id"
    return false
  }
  if (!user) {
    response.status = "Usuário inexistente"
    return false
  }
  if (!sr) {
    response.status = "Skill inexistente"
    return false
  }
  if (req.trx_type === 0 || req.trx_type === 1) {}
  else {
    response.status = "trx_type inválido / inexistente. Mande 1 para comprar ou 0 para vender."
    return false
  }

  return true
}

const postTrxSr = async (req, res) => {
  const response = { status: "ERROR" }
  console.log("id ..........", req.body);

  const user = await User.query().where({ username: req.body.username }).first()
  const sr = await Sr.query().where({ sr_id: req.body.sr_id }).first()

  if (!validaEntry(req.body, user, sr, response)) {
    return res.status(400).json(response)
  }

  if (user && sr) {
    console.log("funcionando");
    const newUserSr = await UserSr.query().insert({
      user_id: user['id'],
      sr_id: sr['id']
    })
    if (newUserSr instanceof UserSr) {

      const newBilling = await Billing.query().insert({
        trx_type: req.body.trx_type,
        amount: sr['price'],
        user_id: user['id'],
        user_sr_id: newUserSr['id']
      })

      if (newBilling instanceof Billing) {
        if (req.body.trx_type === 1) {
          response.status = "Skill comprada"
        }
        response.status = "Skill vendida"
        return res.status(200).json(response)
      }
    }
  }

  return res.status(400).json(response)
}

module.exports = postTrxSr
