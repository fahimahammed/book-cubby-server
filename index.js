const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const app = express()

const port = process.env.PORT || 3004

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpqcv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("bookCubby").collection("books");
  const orderCollection = client.db("bookCubby").collection("orders");
  

  app.get('/books', (req, res) => {
    collection.find()
    .toArray((err, items) => {
        res.send(items);
        //console.log(items);
    })
})

app.get('/orders/:email', (req, res) => {
  orderCollection.find({email: req.params.email})
  .toArray((err, items) => {
      res.send(items);
      //console.log(items);
  })
})


  app.post('/addBook', (req, res) => {
      const newBook = req.body;
      collection.insertOne(newBook)
      .then(result => console.log(result.insertedCount))
      res.send(result.insertedCount > 0)
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => console.log(result.insertedCount))
    res.send(result.insertedCount > 0)
})

app.delete('/delete/:id', (req, res) => {
  const id = ObjectId(req.params.id);
  collection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value));
  
})

  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})