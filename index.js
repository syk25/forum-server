//👇🏻index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/* 회원가입 db, id 생성기 */
const users = []; // 모든 사용자를 보관하기 위한 배열 db
const generateID = () => Math.random().toString(36).substring(2,10); // id로 쓰일 예정

/* 회원가입 API */
app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;
    const id = generateID();
    // 회원가입 시 동일인인지 유효성 검사
    const result = users.filter(
        (user) => user.email === email && user.password === password
    );
    //👇🏻 if true
    if (result.length === 0) {
        const newUser = { id, email, password, username };
        //👇🏻 adds the user to the database (array)
        users.push(newUser);
        //👇🏻 returns a success message
        return res.json({
            message: "Account created successfully!",
        });
    }
    //👇🏻 if there is an existing user
    res.json({
        error_message: "User already exists",
    });
});

/* api test */
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

/* 로그인 기능 구현 */
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    //👇🏻 checks if the user exists
    let result = users.filter(
        (user) => user.email === email && user.password === password
    );
    //👇🏻 if the user doesn't exist
    if (result.length !== 1) {
        return res.json({
            error_message: "Incorrect credentials",
        });
    }
    //👇🏻 Returns the id if successfuly logged in
    res.json({
        message: "Login successfully",
        id: result[0].id,
    });
});