const Collection = require('./models/name-collection')

const mongoose = require('mongoose')

// #region
const url = 'mongodb://127.0.0.1:27017/name-database'

mongoose.connect(url, 
  { useNewUrlParser: true ,  
    useUnifiedTopology: true,
    useCreateIndex: true 
  })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

// #endregion


async function runCode() {
  const ryu = new Collection({
    name: 'Ryu',
    ultimate: 'Shinku Hadoken'
  })

  const ken = new Collection({
    name: 'Ken',
    ultimate: 'Guren Enjinkyaku'
  })

  await Collection.deleteMany({})

  await ryu.save()
  await ken.save()

  const ryu_result = await Collection.findOne({ name: 'Ryu' })
console.log(ryu_result)

}

runCode()
  .catch(error => { console.error(error) })