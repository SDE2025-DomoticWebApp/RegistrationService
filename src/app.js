const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/register', require('./routes/registration.routes'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Registration Service running on port ${PORT}`);
});
