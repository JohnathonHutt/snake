//jshint esversion: 6

const express = require("express");

//best practices names app
const app = express();

//to access frontend files link="folderInPublic/filname.ext"
app.use(express.static("public"));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000...  Hail Hydra");
});
