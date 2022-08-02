const { query } = require("express")

var sqlite3 = require("sqlite3").verbose()
const  db = new sqlite3.Database('./user.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { console.log(err) }
        else {
            console.log("Successful")
        }
    })

function createUserTable(db){
   data='CREATE TABLE IF NOT EXISTS "users" ("Name"	TEXT n NOT NULL,"Email"	TEXT NOT NULL UNIQUE,"Password"	TEXT NOT NULL,"Id"	INTEGER,PRIMARY KEY("Id" AUTOINCREMENT));'
   db.run(data)
   data='CREATE TABLE IF NOT EXISTS "countTable"("Email" TEXT NOT NULL UNIQUE,"Attempts" INTEGER , "Id" INTEGER ,PRIMARY KEY("Id" AUTOINCREMENT))'
   db.run(data)
   data='CREATE TABLE IF NOT EXISTS "blockList"("Email" TEXT NOT NULL UNIQUE,"Time" TEXT NOT NULL,"Id" INTEGER ,PRIMARY KEY("Id" AUTOINCREMENT))'
   db.run(data)
}
function addBlockList(db,data,callback){
    var addQuery='INSERT INTO "blockList"("Time","Email") VALUES(?,?);'
    console.log(data)
    db.run(addQuery,data,(err)=>{
        if(err){
            callback(false)
        }
        else{
            callback(true)
        }
       })
}
function findFromBlockList(db,email,callback){
    var findQuery="SELECT * FROM blockList WHERE Email=?;"
    db.all(findQuery,[email],(err,data)=>{
        if(err){
            console.log(err)
            callback(false)
        }
        else{
            if(data.length==0){
                callback(false)
            }
            //present in Block List
            else{
                //if 24 hours completed then remove from block list

                if(finding24Hour(data)==true){
                    callback(false)
                    deleteFromBlockList(db,email,callback=>{
                       if(callback){
                        console.log("Removed form blocked list")
                       }
                       else
                          console.log("Error occure in deleting the table") 
                    })
                }
                else{
                    // still time left to be 24 hours
                    callback(true)
                }
            }
        }
    })    
}
function deleteFromBlockList(db,email,callback){
    var  deleteQuery='DELETE FROM blockList WHERE "Email"=?;'
    db.run(deleteQuery,[email],(err)=>{
        if(err){
            console.log(err)
            callback(false)
        }else{
            callback(true)
        }
    })
}
function addCountTable(db,data,callback){
    var addQuery='INSERT INTO countTable("Email","Attempts") VALUES(?,?);'
   db.run(addQuery,data,(err)=>{
    if(err){
        console.log(err)
        callback(false)
    }
    else{
        callback(true)
    }
   })
}   
function updateCountTable(db,data,callback){
    var updateQuery='UPDATE countTable SET Attempts = ? WHERE Email = ?;'
    console.log(data)
    db.all(updateQuery,data,(err,data)=>{
        if(err){
            callback(false)
        }
        else{
            callback(true)
        }
    })
}
function findFromCountTable(db,email,callback){
    var findQuery="SELECT * FROM countTable WHERE Email=?;"
    db.all(findQuery,[email],(err,data)=>{
        if(err){
            console.log(err)
            callback(false)
        }
        else{
            console.log(data)
            if(data.length==0)
                callback(0)
            else
                {
                callback(data[0]['Attempts'])
                }
        }
    })
}
function deleteFromCountTable(db,email,callback){
    var  deleteQuery='DELETE FROM countTable WHERE "Email"=?;'
    db.run(deleteQuery,[email],(err)=>{
        if(err){
            console.log(err)
            callback(false)
        }else{
            callback(true)
        }
    })
}
function addUser(db,name,email,password,callback){
  var addQuery='INSERT INTO "users"("Name","Email","Password") VALUES(?,?,?);'
   db.run(addQuery,[name,email,password],(err)=>{
    if(err){
        console.log(err)
        callback(false)
    }
    else{
        callback(true)
    }
   })
   
}
function findAllUser(db,callback){
    var findQuery="SELECT * FROM users"
    db.all(findQuery,(err,data)=>{
        if(err){
            console.log(err)
            callback(false)
        }
       else if(data.length==0){
            callback(false)
        }
        else{
            callback(data)
        }
    })
}
function editUser(db,data,callback){
    var updateQuery='UPDATE users SET "Name" = ? ,"Password"=? WHERE "Email"=?;'
    db.run(updateQuery,data,(err)=>{
        if(err){
            callback(false)
        }
        else{
            callback(true)
        }
    })
}
function deleteUser(db,email,callback){
  var  deleteQuery='DELETE FROM users WHERE "Email"=?;'
    db.run(deleteQuery,[email],(err)=>{
        if(err){
            console.log(err)
            callback(false)
        }else{
            callback(true)
        }
    })
}
function findUser(db,email,callback){
    var findQuery="SELECT * FROM users WHERE Email=?;"
    db.all(findQuery,[email],(err,data)=>{
        if(err){
            console.log(err)
            callback(false)
        }
        else{
            callback(data)
        }
    })
}
// 24 hour counting is remaining
function finding24Hour(data){
    var timeNow=calculateTime()
    console.log(timeNow)
    var oldtime=data[0]["Time"]
     timeNow = new Date(Date.parse(timeNow))
     oldtime =new Date(Date.parse(oldtime))
     console.log(oldtime,timeNow)
     var dif=(timeNow.getTime() -oldtime.getTime())/(1000*60*60)
     console.log(dif)
     if(dif>24){
        return true
     }
     else{
        return false
     }
}
function calculateTime(){
    return formatDate(new Date())
}

function formatDate(date){
    return ('{0}-{1}-{3} {4}:{5}:{6}').replace('{0}', date.getFullYear()).replace('{1}', date.getMonth() + 1).replace('{3}', date.getDate()).replace('{4}', date.getHours()).replace('{5}', date.getMinutes()).replace('{6}', date.getSeconds())
}
createUserTable(db)
module.exports = { db,findUser,findAllUser,deleteUser,addUser,editUser,addCountTable,updateCountTable,deleteFromCountTable,findFromCountTable
                    ,addBlockList,deleteFromBlockList,findFromBlockList,calculateTime}