const express = require('express')
const app = express();

const taskModel = require('./models/userTask')
const bodyParser = require('body-parser');
const {userModel,userValidator}=require('./models/user')
let loggedInUser=null;

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//signup route
app.get('/signup',(req,res)=>{
    res.render("signup")
})
//signup route post:
app.post('/signup',async(req,res)=>{
    const{username,email,password}=req.body;

    //joi validation:

    let error = userValidator({username,password,email})
    if(error){
        return res.send(error.message)
    }
    //checking that user already exist in database or not:
    let existUser =await userModel.findOne({$and:[{username},{email}]});
    if(existUser){
        return res.status(400).json({ message: 'User with this username or email already exists.' });
    }

    else{
 //if not exist create user and redirect to login page
        let createUser = await userModel.create({
            username,
            email,
            password
        })
    }
   //redirect to login page:
   res.redirect('/')
});
//login route:
app.get('/',(req,res)=>{
    
    res.render("login")

 })

 //post route for login
 app.post('/',async(req,res)=>{
const{username,password}=req.body;
loggedInUser=username;
let userExist = await userModel.findOne({username});
if(!userExist){
   res.render('signup')
}
else
res.redirect('/home')

 })






app.get('/home',(req,res)=>{
    
   res.send("working")
})


app.listen(3000);

