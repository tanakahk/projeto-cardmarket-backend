const { jwtSign } = require('../../helpers/jwtHelpers')
const { pwdEncode } = require('../../helpers/pwdHelpers')
const User = require('../../models/User')

const validateRequest = (req, response) => {
  if (!req.body.username) {
    response.status = "NO_USERNAME"
    return false
  }

  if (!req.body.password) {
    response.status = "NO_PASSWORD"
    return false
  }
  return true
}

const postSignup = async (req, res) => {
  const response = { status: "ERROR" }

  if (!validateRequest(req, response)) {
    return res.status(400).json(response)
  }

  const user = await User.query().where({ username: req.body.username }).first()
  if (user) {
    response.status = "USER_EXISTS"
    return res.status(401).json(response)
  }

  const newUser = await User.query().insert({
    username: req.body.username,
    password: pwdEncode(req.body.password),
  })
  if (newUser instanceof User) {
    response.status = "OK"
    response.result = {
      id: newUser.id,
      username: newUser.username,
      token: jwtSign({ id: newUser.id }),
    }
  }
  return res.json(response)
}

module.exports = postSignup
