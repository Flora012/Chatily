const express = require("express");
const cors = require("cors");
const errorHandler = require("./api/middlewares/errorHandler");

const app = express();

// CORS beállítások
app.use(cors({
    origin: "http://localhost:3000",  // Engedélyezi a frontend kéréseit
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Engedélyezett fejlécek és metódusok
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

// Middleware-k
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API végpontok betöltése (ha külön van)
const authRoutes = require("./api/routes/authRoutes");
app.use("/api/v1", authRoutes);

// Hiba kezelők
app.use(errorHandler.notFoundError);
app.use(errorHandler.showError);

module.exports = app;
