// Require the needed assets / modules
const express = require('express');
const mongoose = require('mongoose');
const appl = express();
const cors = require('cors');
const bodyParser = require("body-parser");

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property. This one only uses json.
appl.use(bodyParser.json());
// Application will use Cross Origin Resource Sharing
appl.use(cors());
// Set Schema to a mongoose schema.
var Schema = mongoose.Schema;
// Set a variable for the ObjectId in mongodb.
var ObjectId = Schema.ObjectId;
// Define the Schema with an _id, title, completed and default collection.
var todoSchema = new Schema({
    _id: ObjectId,
    title: String,
    completed: Boolean },
    { collection: 'todo' }
);
// Set Todo model based on the todoSchema just defined.
var Todo = mongoose.model('todo', todoSchema);

// API's. Based on mongoose.

// Gets and sends all todos using a query, setting a collection and then executing the query.
appl.get('/todo', function (req, res) {
  let query = Todo.find(); // `query` is an instance of `Query`
  query.setOptions({
    lean: true
  });
  query.collection(Todo.collection);
  query.exec(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

// Posts a todo item, creating it from the request body (which is a todo).
appl.post('/todo', function (req, res, next) {
  Todo.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.send(data);
    }
  })
});

// Finds and removes a todo item using the id in the req.params.id.
appl.delete('/todo/:id', function (req, res, next) {
  Todo.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      // Sets the response to 200 (OK) and sets msg to data.
      res.status(200).json({
        msg: data
      })
    }
  })
});

// Replaces an item, using the req.params.id and the request.body as replacement.
appl.put('/todo/:id', function (req, res, next) {
  Todo.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      // Response is the data.
      res.json(data)
      console.log('Todo successfully updated!')
    }
  })
});

// Starts the webserver on port 6789.
const websvr = appl.listen(6789, function () {
  console.log('Node Web Server is running...');
});

// Connect to the mongoDB.
mongoose.connect('mongodb://localhost:27017/hook');