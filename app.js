const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
}));

const authRouter = require("./api/routes/authRoutes");
const usersRouter = require("./api/routes/usersRouter");
const searchRouter = require("./api/routes/searchRouter");
const notificationRoutes = require("./api/routes/notifyRoutes");
const friendshipRouter = require("./api/routes/friendshipRouter");
const groupsRouter = require('./api/routes/groupsRouter');
const groupMessagesRouter = require('./api/routes/groupMessagesRouter');
const groupMembersRouter = require('./api/routes/groupMembersRouter');  
const path = require('path');



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/search", searchRouter);
app.use("/notifications", notificationRoutes);
app.use("/notify", friendshipRouter);
app.use('/groups', groupsRouter);
app.use('/groupMessages', groupMessagesRouter);
app.use('/groupMembers', groupMembersRouter); 



module.exports = app;
