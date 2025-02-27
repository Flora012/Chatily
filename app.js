const express = require("express");
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173',
}))

const users = require("./api/routes/authRoutes");
const loginUser = require("./api/routes/usersRouter")
const searchUser = require("./api/routes/searchRouter")
const meRouter = require("./api/routes/meRouter")


app.use("/user",users);
app.use("/login",loginUser)
app.use("/search", searchUser)
app.use("/me", meRouter)


module.exports = app;