const express=    require('express');
const app = express();
const dotenv=require('dotenv');
const database = require("./Configuration/Database");

const port = process.env.PORT || 4000;

database.connect();

app.get("/",(req, res) => {
    return res.json({
    success: true,
    message: 'Hello World'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
