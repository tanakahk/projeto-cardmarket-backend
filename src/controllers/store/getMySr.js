const Billing = require("../../models/Billing");
const Sr = require("../../models/Sr");
const User = require("../../models/User");
const UserSr = require("../../models/UserSr");

const getMySr = async (req, res) => {
  const response = { status: "ERROR", result: [] }

  if (!req.body.username) {
    response.status = "Usuário não encontrado"
    delete response.result
    return res.status(400).json(response)
  }

  // verifica se o user existe na table user e retorna a entry dele
  const user = await User.query().where({ username: req.body.username }).first()

  // verifica se user pegou algum resultado
  if (!user) {
    response.status = "Usuário inválido"
    delete response.result
    return res.status(400).json(response)
  }

  // exibe as entradas que tem o user_id recebido, é de compra e o campo deleted_at está vazio
  const billing = await Billing.query().where({ user_id: user.id, trx_type: 1 }).whereNull('deleted_at').orderBy('user_sr_id')

  // verifica se billing pegou algum resultado
  if (!billing.length > 0) {
    response.status = "Usuário nunca comprou aqui"
    delete response.result
    return res.status(400).json(response)
  }

  // faz um loop no array billing filtrado
  for (let i = 0; i < billing.length; i++) {

    // pega as entries da table user_sr. Onde é usado a entry filtrada do billing para descobrir o id q liga com a table sr.
    const user_sr = await UserSr.query().where({ id: billing[i].user_sr_id })

    // verifica se user_sr pegou algum resultado
    if (!user_sr.length > 0) {
      response.status = "Ocorreu um problema com a tabela q liga o usuário com as skills (user_sr)"
      delete response.result
      return res.status(500).json(response)
    }

    // faz um loop no array user_sr filtrado
    for (let i_sr = 0; i_sr < user_sr.length; i_sr++) {

      // consulta a table sr usando o sr_id da table user_sr q liga com a primary key id da table sr
      const sr = await Sr.query().where({ id: user_sr[i_sr]['sr_id'] })

      // verifica se sr pegou algum resultado
      if (!sr.length > 0) {
        response.status = "Ocorreu um problema com a tabela das skills (sr)"
        delete response.result
        return res.status(500).json(response)
      }

      // Coloca na resposta para o user o ID real da skill (repete se precisar)
      response.result.push(sr[i_sr]['sr_id'])
    }
  }

  if (response.result) {
    response.status = "OK"
    return res.status(200).json(response)
  }

  return res.status(500).json(response)
}

module.exports = getMySr
