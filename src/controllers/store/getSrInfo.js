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
  const defaultSrUrl = "https://github.com/Nayuta-Kani/SAOIF-Skill-Records-Database/blob/master/srimages/sr_icon_l_610"

  // console.log("sr_id .......", req.params.sr_id);

  // ------------------------------ valida o ID
  if (!validaSrId(response, req.params.sr_id)) {
    return res.status(400).json(response)
  }

  // ------------------------- cria o url a partir do ID
  let tempUrl = ''
  tempUrl = tempUrl.concat(`${defaultSrUrl}`, req.params.sr_id, '.png?raw=true')

  // -------------- cria a reposta do user com as infos do ID q ele pediu
  response.result = {
    id: req.params.sr_id,
    url: tempUrl,
    atk: generateRandomNumber(20, 70),
    hp: generateRandomNumber(50, 3500),
    def: generateRandomNumber(30, 80),
    cost: generateRandomNumber(5, 45),
    sp: generateRandomNumber(10, 50),
    cooldown: generateRandomNumber(4, 30),
    price: generateRandomNumber(100, 10000),
  }

  // ------ retorna status positivo e o array caso dê td certo
  if (response.result) {
    response.status = "OK"
    return res.json(response)
  }

  // ------- Caso ele ainda n tenha sido retornado, dá um erro
  return res.status(400).json(response)
}

module.exports = getSrInfo
