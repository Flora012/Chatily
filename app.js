const express = require("express");

const app = express();

const errorHandler = require("./api/middlewares/errorHandler");


app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(errorHandler.notFoundError);

app.use(errorHandler.showError);

module.exports = app;