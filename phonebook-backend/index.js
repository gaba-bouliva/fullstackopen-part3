
require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
require('http')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'));

morgan.token('param', function(req, res) {
    return JSON.stringify(req.body);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => { 
    console.log("People contacts: ", persons);
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const reqDate = Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${reqDate}</p>`)
})

app.get('/api/persons/:id', (req, res, next) => {

  const id = Number(req.params.id)
  const person = Person.findById(req.params.id).then(person => { 

    if (!person) {
      res.status(404).end()
    } else {
      res.json(person)
    }

  }).catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then( result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  
  const person = {
    name: body.name,
    number: body.number,
  } 

  Person.findByIdAndUpdate( req.params.id, 
                            person,
                            { new: true, runValidators: true, context: 'query'}
                          ).then( updatedPerson => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body
    
    if (!newPerson || !newPerson.hasOwnProperty('name') || !newPerson.hasOwnProperty('number')) {
      res.status(400).send({error: 'name and number are required'})
      return
    }

    const person = new Person({
      name: newPerson.name,
      number: newPerson.number
    })
    
    person.save().then(savedPerson => {
      res.json(savedPerson)
    }).catch( error => next(error))

  
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Invalid id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message})
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

