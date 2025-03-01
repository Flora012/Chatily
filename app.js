const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
}));

const users = require("./api/routes/authRoutes");
const loginUser = require("./api/routes/usersRouter");
const searchUser = require("./api/routes/searchRouter");
const notificationRoutes = require("./api/routes/notifyRoutes");
const friendshipRouter = require("./api/routes/friendshipRouter");

app.use("/user", users);
app.use("/login", loginUser);
app.use("/search", searchUser);
app.use("/notifications", friendshipRouter); // Barátjelölések és értesítések egy helyen
console.log("🚀 Server is starting...");


console.log("✅ notifyRoutes loaded");

app.use("/notify", friendshipRouter);

console.log("✅ /notify route registered");


module.exports = app;
