const express = require('express')
const app = express()


app.get('/', (req, res) => {
  res.send('<h1>Test phonebook backend works!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})