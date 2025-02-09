require("dotenv").config();
require("./api/db/dbContext");

const app = require("./app");

const PORT = process.env.PORT || 3000;  // Ha nincs beállítva PORT, akkor 3000 lesz

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
