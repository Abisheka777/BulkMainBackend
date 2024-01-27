//Basic Installation Statements
const express = require("express")
const cors = require("cors")
//Install NODEMAILER
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const app = express()

//Middleware - That will give full access to the response ,request window
app.use(cors())
app.use(express.json())



mongoose.connect("mongodb+srv://abi:123@cluster0.nr2ckis.mongodb.net/passkey?retryWrites=true&w=majority").
  then(function () {
    console.log("Connected to DB")
  }).catch(function () {
    console.log("Failed to Connect")
  })
//we can take data from db with the model alone
const credential = mongoose.model("credential", {}, "bulkmail")




//Only if we are getting the request as /sendmail this function will be invoked . This is invoked if we trigger send function in the frontend
app.post("/sendemail", function (req, res) {
  var msg = req.body.msg
  var emailList = req.body.emailList

  credential.find().
then(function (data) 
{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: data[0].toJSON().user,
      pass: data[0].toJSON().pass,
    }
  })

//Creating promise /A Promise is an Object that links Producing code and Consuming code
//await- Any code executes after the code which has await and we want to use only the async function 
    new Promise(async (resolve, reject) => {
      try {
  
        for (var i = 0; i < emailList.length; i++)
         {
          await transporter.sendMail(
            {
              from: "abishekaantony@gmail.com",
              to: emailList[i],
              subject: 'Test Msg',
              text: msg
  
            }
          )
            console.log("Email Sent to :"+emailList[i])
        }
        resolve.send(true)
  
      }
      catch (error) {
        reject("failed")
      }
    })
    .then(function(error){
      res.send(false)
    })
    .catch(function(){
      res.send(true)
    })
  });
})



//Starting the server
app.listen(5000, function () {
  console.log("Server Started.....")
})


