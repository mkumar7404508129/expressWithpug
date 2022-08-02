const { response } = require('express');
var express = require('express');
var router = express.Router();
var dbcon = require('../database/userDb')
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.isAuth){
    dbcon.findAllUser(dbcon.db,callback=>{
      if(callback){
        res.render('user', { title: 'User',data:callback });
      } 
      else{
        res.render('user',{title:"User",data:[]})
      }
    })
    
  }
  else
    res.redirect('/')
});
router.post("/delete",(req,res,next)=>{
  const {Email}=req.body
  if(req.session.isAuth==false){
    res.sendStatus(203).redirect("/")
  }
  else if(Email){
    dbcon.deleteUser(dbcon.db,Email,callback=>{
      if(callback){
        res.sendStatus(200)
      }
      else
      {
        res.sendStatus(500)
      }
    })
  }
  else{
    req.sendStatus(404)
  }
  
})
router.post("/adduser",(req,res,next)=>{
  const {Name,Email,Password,cPassword}=req.body
  console.log(Name,Email,Password,cPassword)
  if(req.session.isAuth==false){
    res.sendStatus(203).redirect("/")
  }
  else if(Password!=cPassword){
    res.render('user',{title:"User",pmatch:true,data:[]})
  }else{
    dbcon.addUser(dbcon.db,Name,Email,Password,callback=>{
      if(callback){
        res.redirect("/users")
      }
      else{
        res.sendStatus(500).render("user",{title:"User",pmatch:true,data:[]})
      }
    })
  }

})
router.post("/edit",(req,res,next)=>{

  const {Name,Email,Password,cPassword}=req.body
  console.log(Name,Email,Password,cPassword)
  if(req.session.isAuth==false){
    res.sendStatus(203).redirect("/")
  }
  else if(Password!=cPassword){
    res.sendStatus(403).render("user",{title:"User",data:[],edit:true})
  }
  else{
    dbcon.editUser(dbcon.db,[Name,Password,Email],callback=>{
      if(callback){
        res.redirect("/users")
      }
      else{
        res.sendStatus(500).render("/users",{title:"User",data:[]})
      }
    })
  }
})
router.post("/logout",(req,res,next)=>{
  req.session.isAuth=false
  res.redirect("/")
})

module.exports = router;
