const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect("mongodb://202.182.98.219/banana");
let db = mongoose.connection;

db.on('error',function(err){
  console.log(err);
});

db.once('open',function(){
  console.log('link successfully!');
});

const app = express();
let Article = require('./models/article');

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');
app.get('/',function(req,res){
  Article.find({},function(err,articles){
    res.render('index',{
      articles:articles
    });
  });
});


app.get('/layout',function(req,res){
  res.render('layout',{
    title:'Articles'
  });
});

app.get('/articles/new',function(req,res){
  res.render('new',{
    title:'New'
  });
});

app.get('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('show', {
      article: article
    });
  });
});

app.post('/articles/update/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.update(query, req.body, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});



app.get('/articles/:id/edit', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit', {
      title:'edit article',
      article: article
    });
  });
});

app.post('/articles/create', function(req, res) {
  let article = new Article(req.body);

  article.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/articles/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if (err) {
      console.log(err);
    }

    res.send('Success');
  });
});

app.listen(5000, function(){
  console.log('Sever has started on port 5000');
});
