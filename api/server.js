const express = require('express')
const app = express()
const bodyParser= require('body-parser')
// const request = require('request');
var cors = require('cors')
const get = require('lodash/get')
const Collection = require('./models/name-collection')

// #region
const mongoose = require('mongoose')
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

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("body-parser").json()) // to fix json body disappear when post
mongoose.set('useFindAndModify', false);

app.get('/', async (req, res) => {
  //res.sendFile(__dirname + '/index.html')
  const chars = await Collection.find()
  console.log(chars)
  res.send(chars)
  
})

app.post('/', async (req, res) => {
  try {
      // console.log("Hi")
      const name = get(req.body,'name',null)
      const id = get(req.body,'id','')
      const completed = get(req.body,'completed',false)


      if(!name){
        res.status(500).json({
          status: 'error',
          error: {
            message: 'no name'
          }
        }); 
      }
      const naw_task = new Collection({
        id,
        name,
        completed
      })
      const result = await naw_task.save()
      console.log(result)
      res.json(result)
  } catch (error) {
    // console.log(error)
    res.send(error)
  }
})

app.delete('/', async (req, res) => {
  try {
      const id = get(req.body,'id','')

      console.log(id)
      if(!id){
        res.status(500).json({
          status: 'error',
          error: {
            message: 'no name'
          }
        }); 
      }

      const result = await Collection.findOneAndRemove({
        id
      })
      console.log(result)
      res.status(200).json(result);

  } catch (error) {
    // console.log(error)
    res.send(error)
  }
})

app.put('/', async (req, res) => {
  try {

         console.log(req.body)
         const id = get(req.body,'id','')   
         const name = get(req.body,'name',null)
         const completed = get(req.body,'completed',false)
   
   
         if(!id){
           res.status(500).json({
             status: 'error',
             error: {
               message: 'no id'
             }
           }); 
         }
    const result = await Collection.findOneAndUpdate({id},{
      name,
      completed
    }, {
      new: true
    })
    console.log(result)
    res.json(result);

} catch (error) {
  // console.log(error)
  res.send(error)
}
})

// #region
/*
app.get('/', (req, res) => {

    const search = get(req.query,'search','')
    const orderBy = get(req.query,'orderBy','newest') //oldest
    const page = get(req.query,'page',1)
    const pageSize = 50
    const apiKey = `4dfa1bc9-b1e4-45ae-97af-59653d93b645`
    
    const requestString =`https://content.guardianapis.com/search?q=${search}&page=${page}&page-size=${pageSize}&order-by=${orderBy}&api-key=${apiKey}`;
    request(requestString, { json: true }, (err, response, body) => {
      if (err) { return console.log(err); }
      //console.log(body)
      res.send(body)
      // status
      // total
      // startIndex
      // pageSize
      // currentPage
      // pages
      // orderBy
      // results

    });
})

app.get('/article', (req, res) => {

  const id = get(req.query,'id',null)
  if(!id){
    res.send('No id')
    return false
  }
  //res.send(id)
  const apiKey = `4dfa1bc9-b1e4-45ae-97af-59653d93b645`

  const requestString =`https://content.guardianapis.com/${id}?api-key=${apiKey}&show-fields=all`
  //console.log(requestString)
  request(requestString, { json: true }, (err, response, body) => {
    if (err) { return console.log(err); }
    //console.log(body)
    res.send(body)

  });
})
*/
// #endregion

app.listen(8000, () => {
    console.log('Start server at port 8000.')
})