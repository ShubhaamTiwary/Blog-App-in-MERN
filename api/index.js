const express = require('express');
const app=express();
const cors=require('cors');
const User = require('./models/user');
const {mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

const salt= bcrypt.genSaltSync(10);

mongoose.connect('mongodb+srv://shubhaamtiwary:HfWBicaV6Z3xdLw7@cluster0.js9dcme.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) =>{
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password : bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } catch(e){
      res.status(400).json(e);
    }
});

app.listen(4000);

// HfWBicaV6Z3xdLw7
// shubhaamtiwary
