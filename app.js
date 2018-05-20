const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/nodejs-blog");
let db = mongoose.connection;

db.on('error',function(err){
  console.log(err);
});

db.once('open',function(){
  console.log('link successfully!');
});

const app = express();
let Article = require('./models/article');

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

app.get('/aticles/new',function(req,res){
  res.render('index',{
    title:'New'
  });
});

app.listen(5000, function(){
  console.log('Sever has started on port 5000');
});
