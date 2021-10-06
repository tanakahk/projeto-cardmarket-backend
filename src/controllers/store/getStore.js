const getStore = async (req, res) => {
  const response = { status: "ERROR", result: [] }
  const defaultSrUrl = "https://github.com/Nayuta-Kani/SAOIF-Skill-Records-Database/blob/master/srimages/sr_icon_l_610"
  let sr_response = {}

  // ------------- ajusta o numero da pg q o user vai receber ---------
  let page = 1
  if (req.query.page) {
    page = req.query.page
  }

  // --------- ajusta os contadores para o user receber só um intervalo 
  let minCounter = (page * 15 - 15) + 1
  const maxCounter = page * 15
  if (minCounter) {
    let minCounter = page * 15 - 15
  }

  // ----- faz o loop para adicionar a url e o id no array de resultado
  for (minCounter; minCounter <= maxCounter; minCounter++) {

    // -------------- Faz os IDs terem todos 7 dígitos
    let tempId = ''
    let tempUrl = ''
    if (minCounter < 10) {
      tempId = tempId.concat('000', minCounter.toString())
    }
    if (minCounter >= 10 && minCounter < 100) {
      tempId = tempId.concat('00', minCounter.toString())
    }
    if (minCounter >= 100 && minCounter < 1000) {
      tempId = tempId.concat('0', minCounter.toString())
    }
    if (minCounter >= 1000) {
      tempId = minCounter.toString();
    }

    // -------- Configura o objeto para ser colocado no array
    tempUrl = tempUrl.concat(`${defaultSrUrl}`, tempId, '.png?raw=true')
    sr_response = {
      sr_id: parseInt(tempUrl.slice(91, 98), 10),
      sr_url: tempUrl
    }

    // --------------- Adicionar o objeto no array
    response.result.push(sr_response)
  }

  // ------ retorna status positivo e o array caso dê td certo
  if (response.result) {
    response.status = "OK"
    return res.json(response)
  }

  // ------- Caso ele ainda n tenha sido retornado, dá um erro
  return res.status(400).json(response)
}

module.exports = getStore
