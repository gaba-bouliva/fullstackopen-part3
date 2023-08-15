const mongoose = require("mongoose")

mongoose.set('strictQuery', false)

const url = `mongodb+srv://fullstackopen_mongo_db:JPHEPfpwhYve1XQF@cluster0.pfgeizt.mongodb.net/phonebookApp`

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
  name: String, 
  number: String,
})


personSchema.set('toJSON', { 
  transform: (document, returnedObject) => { 
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)