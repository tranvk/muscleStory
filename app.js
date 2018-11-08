const express = require('express');
const app = express();


app.set('view engine', 'hbs);



app.get('/', (req,res) =>{


	res.render('home', template);



});
app.get('/add', (req,res) =>{


	res.render('add', template);



});


app.get('/progress', (req,res) =>{


	res.render('progress', template);



});




app.listen(3000);
