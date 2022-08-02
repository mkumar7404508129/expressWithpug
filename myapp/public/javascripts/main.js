
window.onload = () => {
    infoPage = document.getElementById("infoPage")
    editPage = document.getElementById("edit")
    addUserPage = document.getElementById("adduser")
    editPage.style.display = "none"
    addUserPage.style.display = "none"
   
}

function clickeSubmit(){
    document.getElementById("esubmit").disabled=false
}
function backButton() {
    infoPage.style.display = "block"
    addUserPage.style.display = "none"
    editPage.style.display = "none"
}
function editButton(rowid) {
    infoPage.style.display = "none"
    addUserPage.style.display = "none"
    editPage.style.display = "block"
    var row = document.getElementById(rowid).getElementsByTagName('td')
    document.getElementById("ename").value=row[0].innerText
    document.getElementById("edmail").value=row[1].innerText
}
function deleteButton(rowid) {
    var data = prompt("Do you want to delete record", "yes")
    if (data.toLowerCase() == "yes") {
        var row = document.getElementById(rowid).getElementsByTagName('td')
        console.log(row)
        fetch("http://127.0.0.1:3000/users/delete", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                Email:row[1].innerText
            })
        })
            .then((response) => {
                //do something awesome that makes the world a better place()
                if(response.status==200){
                    alert("User Deleted")
                    window.location.reload()
                }
                else{
                    alert("Some Error")
                }
            })
    }
}
function viewButton(rowid) {
    var row = document.getElementById(rowid).getElementsByTagName('td')
    var name = row[0].innerText
    var email = row[1].innerText
    alert("User Name: " + name + " \nEmail : " + email)
}

function addUser() {
    infoPage.style.display = "none"
    editPage.style.display = "none"
    addUserPage.style.display = "block"
    
}
function matchPass(apassword,acpassword,asubmit){
   password= document.getElementById(apassword).value
   cpassword=document.getElementById(acpassword).value
   submit=document.getElementById(asubmit)
   if(password==cpassword){
    submit.disabled=false
   }
   else{
    alert("Passwords are not same")
    submit.disabled=true
   }

}