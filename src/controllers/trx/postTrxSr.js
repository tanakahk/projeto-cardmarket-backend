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
  return true
}

const postTrxSr = async (req, res) => {
  const response = { status: "ERROR" }

  const user = await User.query().where({ username: req.body.username }).first()
  const sr = await Sr.query().where({ sr_id: req.body.sr_id }).first()

  if (!validaEntry(req.body, user, sr, response)) {
    return res.status(400).json(response)
  } else {
    const newUserSr = await UserSr.query().insert({
      user_id: user['id'],
      sr_id: sr['id']
    })
    if (newUserSr instanceof UserSr) {
      switch (req.body.trx_type) {
        case 1:
          console.log("comprando");
          const newBillingBuy = await Billing.query().insert({
            trx_type: req.body.trx_type,
            amount: sr['price'],
            user_id: user['id'],
            user_sr_id: newUserSr['id']
          })

          if (newBillingBuy instanceof Billing) {
            response.status = "Skill comprada"
            return res.status(200).json(response)
          }
          break
        case 0:
          console.log("vendendo");
          const newBillingSell = await Billing.query().insert({
            trx_type: req.body.trx_type,
            amount: sr['price'],
            user_id: user['id'],
            user_sr_id: newUserSr['id']
          })

          // find first buyed sr on UserSr by user_id and sr_id
          const buyedUserSr = await UserSr.query().where({ user_id: user['id'], sr_id: sr['id'] }).whereNull('deleted_at').first()

          if (buyedUserSr instanceof UserSr) {
            // set deleted_at column on UserSr by id
            const setUserSrDeletedDate = await UserSr.query().patch({ deleted_at: new Date() }).findById(buyedUserSr.id)

            if (setUserSrDeletedDate) {
              // set deleted_at column on Billing by user_sr_id
              const setBillingDeletedDate = await Billing.query().where({ user_sr_id: buyedUserSr.id }).patch({ deleted_at: new Date() })

              if (setBillingDeletedDate) {
                response.status = "Skill vendida"
                return res.status(200).json(response)
              }
            }
          }
          break
        default:
          response.status = "trx_type inválido / inexistente. Mande 1 para comprar ou 0 para vender."
          return res.status(400).json(response)
      }
    }
  }
  return res.status(400).json(response)
}

module.exports = postTrxSr
