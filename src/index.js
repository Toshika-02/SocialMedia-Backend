const express = require("express");
const bodyParser = require("body-parser")
const route = require("./route/route.js");
const  mongoose  = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://toshika:MyProject@cluster0.dr0wqf4.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 10000, function () {
  console.log("Express app running on port " + (process.env.PORT || 10000));
});
