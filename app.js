//jshint esversion:6
// installed a package mongoose-encryption for level 2
//install a package dotenv for level 3.
require("dotenv").config();//level 3 , it's must to be the first line .
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");//level 2 encryption

const app=express();



app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true 
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userschema=new mongoose.Schema({//I added "new mongoose.Schema()" for  level 2 in Authentication (encryption).
    email: String,
    password: String
});

// const secret="Thisisourlittlecedret.";//level 2 //after i used it in the level 2 , i will to use it from the .env file in level 3/
userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});//level 2 // process.env.SECRET for level 3 (.env file) , befor it was "secret" that i definded above.

const User=new mongoose.model("User",userschema);

app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
    });


app.get("/register",function(req,res){
        res.render("register");
        });


app.post("/register",function(req,res){
    const newUser= new User({
        email:req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err)
        {
            consol.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });
     
});      

app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;
User.findOne({email:username},function(err,foundUser){
if(err){
    console.log(err);
}
else
{
    if(foundUser.password===password){
        res.render("secrets");
    }
}
});
});

app.listen(3000,function(){
console.log("server started on port 3000");
});
