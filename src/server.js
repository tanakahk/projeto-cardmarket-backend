const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const routerV1 = require('./router/v1')

app.use(bodyParser.json())
app.use(cors())
app.use(routerV1)

const port = process.env.NODE_ENV === "test" ? 5001 : 5000
app.listen(port, () => {
  console.log(`Working on port: ${port}`);
})

module.exports = app
