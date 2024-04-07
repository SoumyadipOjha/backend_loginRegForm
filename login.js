var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/usersdetails", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", (err) => console.log("Error in Connecting to Database: " + err));
db.once("open", () => console.log("Connected to Database"));

// Serve the index.html file
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath);
});

app.post("/sign_up", (req, res) => {
  try {
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var phno = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;

    var data = {
      name: name,
      age: age,
      email: email,
      phno: phno,
      gender: gender,
      password: password,
    };
    db.collection("users").insertOne(data, (err, collection) => {
      if (err) {
        throw err;
      }
      console.log("Record Inserted Successfully");
      res.redirect("/"); // Redirect back to index.html
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/loginReg", (req, res) => {
  const filePath = path.join(__dirname, "loginReg.html");
  res.sendFile(filePath);
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
