var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  process.env.MONGODB_CONNECT_URI,
  // "mongodb+srv://soumyadipojha635:vUkbHyzZOtnFIHSV@userdetails.cny8wml.mongodb.net/?retryWrites=true&w=majority&appName=userDetails",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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
      res.redirect("/received"); // Redirect back to index.html
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/received", (req, res) => {
  const filePath = path.join(__dirname, "received.html");
  res.sendFile(filePath);
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
