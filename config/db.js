const mongoose = require("mongoose");

function dbConnection() {
  mongoose
    .connect("mongodb://0.0.0.0:27017/mvc_project")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Mongo Error: ", err));
}

module.exports = dbConnection;
