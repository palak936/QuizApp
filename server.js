const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
app.use(cookieparser());
const session = require("express-session");
const oneday = 1000 * 60 * 60 * 24;
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: "asd3454#$%$@#324",
    cookie: { maxAge: oneday },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("."));
app.use("/images", express.static(path.join(__dirname, "images")));

let db;
let collection;
let usercollection;
let htmlcollection;
let javaScriptcollection;
let linuxcollection;
let dbmscollection;
MongoClient.connect("mongodb+srv://palak1317:palak1317@cluster0.fqnpb6k.mongodb.net/QuizApp")
  .then((client) => {
    console.log("Connected to the database");
    db = client.db("QuizApp");
    usercollection = db.collection("Users");
    htmlcollection = db.collection("HtmlQuestions");
    javaScriptcollection = db.collection("javascriptQuestions");
    linuxcollection = db.collection("LinuxQuestions");
    dbmscollection = db.collection("DbmsQuestions");
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });
app.post("/log", (req, res) => {
  const username = req.body.username; 
  usercollection
    .find({ username: username, password: req.body.password }) 
    .toArray()
    .then((data) => {
      if (data.length > 0) {
        res.sendFile(path.join(__dirname, "home.html"), { user: username }); 
      } else {
        res.sendFile(path.join(__dirname, "login.html"));
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signUp.html"));
});

app.post("/sign", (req, res) => {
  usercollection
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then((data) => {
      if (data.length > 0) {
        res.status(409).send("UserName already Exists");
      } else {
        let obj = {};
        obj.username = req.body.username;
        obj.password = req.body.password;
        obj.email = req.body.email;
        //obj.img = "images/profile.jpeg";
        usercollection.insertOne(obj).then(() => {
          res.sendFile(path.join(__dirname, "home.html"));
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/htmlpage", (req, res) => {
  htmlcollection.find().toArray().then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/javascriptpage", (req, res) => {
  javaScriptcollection
    .find()
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/linuxpage", (req, res) => {
  linuxcollection
    .find()
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});
app.get("/dbmspage", (req, res) => {
  dbmscollection
    .find()
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});
app.listen(3000, () => {
  console.log("Server Started");
});
