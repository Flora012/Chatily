const express = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

// ROUTES

app.use(express.static("public"))



module.exports = app;