const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
var fs = require('fs');
const appl = express();
const cors = require('cors');
const bodyParser = require("body-parser");
appl.use(bodyParser.json());

appl.use(cors());

appl.use(bodyParser.urlencoded({
  extended: false
}));
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var todoSchema = new Schema({
    _id: ObjectId,
    title: String,
    completed: Boolean },
    { collection: 'todo' }
);

var Todo = mongoose.model('todo', todoSchema);

//load all files in models dir

// fs.readdirSync(__dirname + '/models').forEach(function (filename) {
//   if (~filename.indexOf('.js')) {
//     require(__dirname + '/models/' + filename);
//     console.log('required:', filename);
//   }
// });

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

appl.post('/todo', function (req, res, next) {
  // Add todo
  Todo.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.send(data);
    }
  })
});

appl.delete('/todo/:id', function (req, res, next) {
  // Delete todo
  console.log(req.params.id);
  Todo.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
});


const websvr = appl.listen(6789, function () {
  console.log('Node Web Server is running...');
});

mongoose.connect('mongodb://localhost:27017/hook');