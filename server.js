
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const friendshipRoutes = require('./routes/friendshipRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/friendships', friendshipRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
