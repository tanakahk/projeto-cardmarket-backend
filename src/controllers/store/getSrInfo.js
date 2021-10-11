const SrStatus = require("../../models/SrStatus");
const Sr = require("../../models/Sr");
const SrImage = require("../../models/SrImage");

// ------------------------ Função para gerar números aleatórios
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --------------------------- Função para validar o ID
const validaSrId = (response, id) => {
  if (id.length != 7) {
    response.status = "O ID está incorreto"
    return false
  }
  if (id.slice(0, 3) != 600) {
    response.status = "O ID está incorreto"
    return false
  }
  return true
}

const getSrInfo = async (req, res) => {
  const response = { status: "ERROR" }
  let tempSr = {}
  const defaultSrUrl = "https://github.com/Nayuta-Kani/SAOIF-Skill-Records-Database/blob/master/srimages/sr_icon_l_"

  // ------------------------------ valida o ID
  if (!validaSrId(response, req.params.sr_id)) {
    return res.status(400).json(response)
  }

  // ------------------------- cria o url a partir do ID
  let tempUrl = ''
  tempUrl = tempUrl.concat(`${defaultSrUrl}`, req.params.sr_id, '.png?raw=true')

  // ----------------- verifica se o ID que o user passou já tem uma entry no banco srs
  const sr_status = await Sr.query().where({ sr_id: req.params.sr_id }).first()
  if (sr_status) {

    // --------------- consulta o sr para pegar o id q relaciona as tabelas
    const newSrId = await Sr.query().where({ sr_id: req.params.sr_id }).first()
    // --------------- consulta o sr_status para pegar os status usando o id relacional
    const newStatus = await SrStatus.query().where({ sr_id: newSrId['id'] }).first()

    tempSr = {
      id: sr_status['sr_id'],
      url: tempUrl,
      atk: newStatus['atk'],
      hp: newStatus['hp'],
      def: newStatus['def'],
      cost: newStatus['cost'],
      sp: newStatus['sp'],
      cooldown: newStatus['cooldown'],
      price: sr_status['price']
    }
  } else {
    // ------------------- se não tiver, ele insere as infos
    const newSr = await Sr.query().insert({
      price: generateRandomNumber(100, 10000),
      sr_id: parseInt(req.params.sr_id, 10)
    })

    const newSrId = await Sr.query().where({ sr_id: req.params.sr_id }).first()
    const newStatus = await SrStatus.query().insert({
      atk: generateRandomNumber(20, 70),
      hp: generateRandomNumber(50, 3500),
      def: generateRandomNumber(30, 80),
      cost: generateRandomNumber(5, 45),
      sp: generateRandomNumber(10, 50),
      cooldown: generateRandomNumber(4, 30),
      sr_id: newSrId['id']
    })

    const newImage = await SrImage.query().insert({
      url: tempUrl,
      sr_id: newSrId['id']
    })

    tempSr = {
      id: newSr['sr_id'],
      url: tempUrl,
      atk: newStatus['atk'],
      hp: newStatus['hp'],
      def: newStatus['def'],
      cost: newStatus['cost'],
      sp: newStatus['sp'],
      cooldown: newStatus['cooldown'],
      price: newSr['price']
    }
  }

  // ------------ cria a reposta do user com as infos do ID q ele pediu e retorna as infos para ele
  if (tempSr) {
    response.status = "OK"
    response.result = {
      id: tempSr['id'],
      url: tempSr['url'],
      atk: tempSr['atk'],
      hp: tempSr['hp'],
      def: tempSr['def'],
      cost: tempSr['cost'],
      sp: tempSr['sp'],
      cooldown: tempSr['cooldown'],
      price: tempSr['price'],
    }
    return res.status(200).json(response)
  }

  // ------- Caso ele ainda n tenha sido retornado, dá um erro
  return res.status(500).json(response)
}

module.exports = getSrInfo
