require('dotenv').config()
const mongoose = require("mongoose")

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url).then(
  result => {
    console.log('Connected to MongoDB');
  }
).catch(err => {
  console.log(err.message);
  process.exit(1)
})

const personSchema = new mongoose.Schema({ 
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{8}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  }
})


personSchema.set('toJSON', { 
  transform: (document, returnedObject) => { 
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)