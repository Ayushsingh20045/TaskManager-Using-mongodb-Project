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

let userExist = await userModel.findOne({username,password});
if(!userExist){
   res.render('signup')
}

else
loggedInUser=userExist;
res.redirect('/home')

 })



//create task:
app.get('/create',async(req,res)=>{
    if(!loggedInUser){
        return res.redirect('/')
    }
    const allTask = await taskModel.find({userid:loggedInUser._id})
    res.render("create",{user:loggedInUser,tasks:allTask})
    
})

app.post('/create',async(req,res)=>{
   
    const{title,description}=req.body;
    if(!loggedInUser){
        return res.redirect('/');
    }
    
    const createTask = await taskModel.create({
        title:title,
        description:description,
        userid:loggedInUser._id
    })
  res.redirect('/home')
})

 //home page:

 app.get('/home',async(req,res)=>{
   if(!loggedInUser){
    return res.redirect('/')
   }
   const allTask = await taskModel.find({userid:loggedInUser._id})
//    console.log(allTask)
   res.render('home',{allTask})
 })

 //view route

 app.get("/view/:id",async(req,res)=>{
    const{id}=req.params;
    if(!loggedInUser){
        return res.redirect('/')
    }
    const view = await taskModel.findOne({_id:id})
//   console.log(view)
  res.render("view",{view:view})
    
 })

 //delete route
 app.get('/delete/:id',async(req,res)=>{
    const{id}=req.params;
    if(!loggedInUser){
      return  res.redirect('/')
    }
 
    const Delete = await taskModel.findOneAndDelete({_id:id})
    res.redirect('/home')

 })

 //edit route
 app.get('/edit/:id',async(req,res)=>{
    if(!loggedInUser){
       return res.redirect('/');
    }
const task =await taskModel.findOne({_id:req.params.id})
  res.render('edit',{task});
 })
 //post route for edit task:
 app.post('/update/:id',async(req,res)=>{
    const{title,description}=req.body;
    const{id}=req.params;
    if(!loggedInUser){
        return res.redirect('/');
     }
     const user = await taskModel.findOne({_id:req.params.id});
     const update= await taskModel.findOneAndUpdate(
        {_id:id},
        {title,description},
        {new:true}
     )
     res.redirect('/home')
 })





app.listen(3000);

