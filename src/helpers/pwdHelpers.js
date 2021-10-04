const bcrypt = require("bcrypt");

const saltRounds = 10;

const pwdEncode = (pwd) => {
  return bcrypt.hashSync(pwd, saltRounds)
}

const pwdCompare = (pwd, hash) => {
  return bcrypt.compareSync(pwd, hash)
}

module.exports = {
  pwdEncode,
  pwdCompare,
}
