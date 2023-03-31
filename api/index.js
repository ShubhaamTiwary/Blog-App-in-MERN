const express = require('express');
const app=express();
const cors=require('cors');
const User = require('./models/user');
const {mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

const secret='havsjhvsvt2gd287'
const salt= bcrypt.genSaltSync(10);

app.use(cookieParser());

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

app.post('/login', async(req,res) =>{
    const {username,password} = req.body;
    const userDoc= await User.findOne({username});
    const passOk=bcrypt.compareSync(password,userDoc.password);
    if(passOk){
      jwt.sign({username ,id:userDoc._id},secret,{},(err,token)=>{
        if(err) throw err;
        res.cookie('token',token).json({
          id:userDoc._id,
          username,
        });
      });
    }
    else{
      res.status(400).json("Wrong Username | Password")
    }
})

app.get('/profile' , (req,res) =>{
  const {token} = req.cookies;
  jwt.verify(token,secret,{},(err,info)=>{
    if(err) throw err;
    res.json(info);
  })
  res.json(req.cookies);
});

app.post('/logout' ,  (req,res) =>{
  res.cookie('token','').json('ok');
})

app.listen(4000);

// HfWBicaV6Z3xdLw7
// shubhaamtiwary
