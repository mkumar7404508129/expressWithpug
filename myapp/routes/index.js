var express = require('express');
var router = express.Router();
var dbcon=require('../database/userDb')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' ,failed:false});
});
function updataInAllTable(dbcon,Email){
  dbcon.findFromCountTable(dbcon.db,Email,callback=>{
    //if it last attempt
    if(callback>=4){
      
      dbcon.addBlockList(dbcon.db,[dbcon.calculateTime(),Email],callback=>{
        if(callback)
            console.log("Added To Block List____")
        
      })
      dbcon.deleteFromCountTable(dbcon.db,Email,callback=>{
          if(callback) 
            console.log("Deleted Form CountTable")
          else
            console.log("Error Occure in delete opereation in countTable")
      })
    }
    //if it first attempt failed add into count table
    else if(callback==0){
      dbcon.addCountTable(dbcon.db,[Email,1],callback=>{
        if(callback)
          console.log("added in countTable Successfull")
        else
          console.log("error during InsertOperation")
      })

    }
    //update the number of attempt
    else{
      console.log(callback)
      dbcon.updateCountTable(dbcon.db,[callback+1,Email],callback=>{
        if(callback)
            console.log("data updated in countTable")
        else 
            console.log("Error during Updating")
      })
    }
  })
}
router.post('/', function(req, res, next) {
  const {Email,password}=req.body
    console.log(Email,password)
    // if user blocked
   dbcon.findFromBlockList(dbcon.db,Email,callback=>{
        if(callback){
          console.log("It is in BlockList")
          res.render('index',{title:"Home",failed:"User in block list for 24 hours"})
          return 0
        }
        else{
          console.log("Not in BlockList")
          dbcon.findUser(dbcon.db,Email,callback=>{
        
            if(callback.length==0)
            {   //checking countTable
                updataInAllTable(dbcon,Email)
              return res.render('index',{title:"Home",failed:"Invalid details"})
            }
            else if(callback[0]['Password']==password){
                //making number of attempt count continous
                dbcon.deleteFromCountTable(dbcon.db,Email,callback=>{
                  if(callback)
                    console.log("data deleted from count table")
                  else
                    console.log('Error occure during delete count table')
                })
                req.session.isAuth=true
               return res.redirect('/users')
            }
            else{
                updataInAllTable(dbcon,Email)
                return res.render('index',{title:"Home",failed:"Invalid Details"})
            }
        })

        }
    })

   
});

module.exports = router;
