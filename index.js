//👇🏻index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
        도연:"그게 아니라! 근데!",
        우정:"에바지예",
        소미:"엽엽",
        상욱:"미정",
        세연:"허허",
        연준:"으악"
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});