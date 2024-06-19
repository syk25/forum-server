//👇🏻index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// mongoose connect
mongoose
    .connect("mongodb+srv://say_01:say_01@cluster0.4xvpm14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

// mongoose set
const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// User Model
const User = mongoose.model("User", UserSchema);


/* 회원가입 db, id 생성기 */
const users = []; // 모든 사용자를 보관하기 위한 배열 db
const generateID = () => Math.random().toString(36).substring(2, 10); // id로 쓰일 예정

// Register endpoint
app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ error_message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
        email,
        password,
        username,
    });

    try {
        await newUser.save();
        res.json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ error_message: "Failed to create account" });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.json({ error_message: "Incorrect credentials" });
    }

    res.json({
        message: "Login successfully",
        id: user._id,
    });
});

/* 스레드 생성 route */
app.post("/api/create/thread", async (req, res) => {
    const { thread, userId } = req.body;
    let threadId = generateID();
    threadList.unshift({
        id: threadId,
        title: thread,
        userId,
        replies: [],
        likes: [],
    });

    res.json({
        message: "Thread created successfully!",
        threads: threadList,
    });
});

//👇🏻 생성 된 포스트 저장
const threadList = [];

/* 스레드 생성 경로 */
app.post("/api/create/thread", async (req, res) => {
    const { thread, userId } = req.body;
    const threadId = generateID();

    //👇🏻 add post details to the array
    threadList.unshift({
        id: threadId,
        title: thread,
        userId,
        replies: [],
        likes: [],
    });

    //👇🏻 Returns a response containing the posts
    res.json({
        message: "Thread created successfully!",
        threads: threadList,
    });
});

/* 스레드 리스트 반환 */
app.get("/api/all/threads", (req, res) => {
    res.json({
        threads: threadList,
    });
});

/* 좋아요 함수 */
app.post("/api/thread/like", (req, res) => {
    //post id 와 user id 확인
    const { threadId, userId } = req.body;
    // 반응을 받은 스레드 확인
    const result = threadList.filter((thread) => thread.id === threadId);
    // 좋아요 수 확인
    const threadLikes = result[0].likes;
    // 반응 인가
    const authenticateReaction = threadLikes.filter((user) => user === userId);
    // 사용자들을 좋아요 배열에 담기
    if (authenticateReaction.length === 0) {
        threadLikes.push(userId);
        return res.json({
            message: "You've reacted to the post!",
        });
    }
    // 에러 유저에게 반환
    res.json({
        error_message: "You can only react once!",
    });
});

/* 답글 표시 반환 */
app.post("/api/thread/replies", (req, res) => {
    //👇🏻 The post ID
    const { id } = req.body;
    //👇🏻 searches for the post
    const result = threadList.filter((thread) => thread.id === id);
    //👇🏻 return the title and replies
    res.json({
        replies: result[0].replies,
        title: result[0].title,
    });
});

/* reply 추가 */
app.post("/api/create/reply", async (req, res) => {
    // post id, user id, reply 찾기
    const { id, userId, reply } = req.body;
    // reply가 달린 Post 찾기
    const result = threadList.filter((thread) => thread.id === id);
    // id를 통해 사용자 조회
    const user = users.filter((user) => user.id === userId);
    // 사용자 이름과 reply 저장
    result[0].replies.unshift({
        userId: user[0].id,
        name: user[0].username,
        text: reply,
    });

    res.json({
        message: "Response added successfully!",
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
