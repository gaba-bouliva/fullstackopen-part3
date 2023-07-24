const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'));

morgan.token('param', function(req, res) {
    return JSON.stringify(req.body);
});



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
    return Math.floor(Math.random() * Date.now())
}

const verifyUniqueName = (name) => {
  const result = persons.find( person => person.name.toLowerCase() === name)
  if (result) return false
  return true
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const reqDate = Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${reqDate}</p>`)
})

app.get('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)
  const person = persons.find( person => person.id === id )

  if (!person) {
    res.status(404).end()
  } else {
    res.json(person)
  }

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter( person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  
    if (person && person.hasOwnProperty('name') && person.hasOwnProperty('number')) {
      
      if(verifyUniqueName(person.name.toLowerCase())) {
        const newPerson = {
          id: generateId(),
          name: person.name,
          number: person.number
        }
        persons.push(newPerson)
        res.json(person)

      }else {
        res.status(400).send({ error: 'name must be unique' })
      }
      
    } else {
      res.status(400).send({error: 'name and number are required'})
    }

  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})