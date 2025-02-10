const app = require("./app")
const cors = require('cors');

require("./api/db/dbContext");

require("dotenv").config();

app.use(cors());

app.listen(3000);